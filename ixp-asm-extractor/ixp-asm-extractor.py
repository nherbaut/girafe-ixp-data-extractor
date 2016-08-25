#!/usr/bin/env python
import argparse
import peeringdb
from pylab import *
import csv
import os


def extract_data_peerdb(ixp, cache):
    pdb = peeringdb.PeeringDB()
    peerings = pdb.all('netixlan', ixlan_id=ixp)
    csv = ""
    totalBW = 0;
    info_types = {};
    for peer in peerings:
        try:
            net = pdb.all('net', asn=peer['asn'])[0]
            print("Name: {0:40} speed:{1:10}M ({2})".format(net['name'], peer['speed'], net['info_type']))
            if not net['info_type'] in info_types:
                info_types[net['info_type']] = 0
            info_types[net['info_type']] += int(peer['speed']);
            csv += "\n%s,%s,%s" % (net['name'], peer['speed'], net['info_type'])
        except:
            print("Name: {0:40} speed:{1:10}M ({2})".format(peer['asn'], peer['speed'], "Error 404"))
            if not '404' in info_types:
                info_types['404'] = 0
            info_types['404'] += int(peer['speed']);
            csv += "\n%s,%s,%s" % (peer['asn'], peer['speed'], 'Error 404')
        totalBW += peer['speed'];

    with open(cache, 'w') as cache_file:
        cache_file.write(csv)

    return info_types


def extract_data_cache(cache):
    info_types = {};
    with open(cache, 'rb') as csvfile:
        spamreader = csv.reader(csvfile, delimiter=',', quotechar='|')
        for row in spamreader:
            try:
                print ("Name: {0:40} speed:{1:10} ({2})".format(row[0], row[1], row[2]))
                if not row[2] in info_types:
                    info_types[row[2]] = 0
                info_types[row[2]] += int(row[1])
            except:
                pass

    return info_types


def makeFigure(info_types, ixp, out, content):
    # calc BW to regroup small value in one
    BW = 0
    for value in info_types:
        BW += info_types[value]
    info_typessimple = {};
    if content:
        for value in info_types:
            if not (value == 'Content') :
                if not 'other' in info_typessimple:
                    info_typessimple['other'] = 0
                info_typessimple['other'] += info_types[value]
            else:
                info_typessimple['Content'] = info_types[value]
    else:
        for value in info_types:
            if float(info_types[value]) / float(BW) < 0.1:
                if not 'other' in info_typessimple:
                    info_typessimple['other'] = 0
                info_typessimple['other'] += info_types[value]
            else:
                info_typessimple[value] = info_types[value]

    figure(1, figsize=(7, 7))
    ax = axes([0.1, 0.1, 0.8, 0.8])

    labels = []
    fracs = []
    for value in info_typessimple:
        labels += [str(value)]
        fracs += [info_typessimple[value]]

    pie(fracs, labels=labels, autopct=lambda (p): '{:.0f}%\n{:.1f}G'.format(p, p * BW / 100 / 1000), shadow=True,
        startangle=90)

    pdb = peeringdb.PeeringDB()
    peerings = pdb.all('ix', id=ixp)[0]

    title(peerings['name'], bbox={'facecolor': '0.8', 'pad': 5})

    # show()
    plt.savefig(out)
    return


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--ixp', "-i", type=str, required=True)
    parser.add_argument('--show-content', dest='content', action='store_true')
    parser.add_argument('--no-cache', dest='cache', action='store_false')
    # args = parser.parse_args()
    parser.add_argument('--out', "-o", type=str, default="")
    parser.add_argument('--cache-file', dest='file', type=str, default="")
    args = parser.parse_args()
    if args.out == "": args.out = args.ixp + ".svg"
    if args.file == "": args.file = args.ixp + "-cache.csvx"

    print(args)
    if (not os.path.isfile(args.file) or not args.cache):
        csv = extract_data_peerdb(args.ixp, args.file)
    else:
        csv = extract_data_cache(args.file)
    makeFigure(csv, args.ixp, args.out, args.content)

    print(csv)
