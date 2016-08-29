#!/usr/bin/env python
import argparse
from datetime import datetime
import json
import pandas as pd


def valid_date(s):
    try:
        return pd.to_datetime(s)-pd.Timedelta("1D")
    except ValueError:
        msg = "Not a valid date: '{0}'.".format(s)
        raise argparse.ArgumentTypeError(msg)

def get_byte_multiplier(s):
    values_prefix={"T":10**12,"G":10**9,"M":10**6,"K":10**3}
    values_bytes={"B":8,"b":1}
    if len(s)==2:
        return values_prefix[s[0].upper()]*values_bytes[s[1]]
    elif s[0] in values_prefix.keys():
        return values_prefix[s[0]]*values_bytes["b"]
    elif s[0] in values_bytes.keys():
        return values_bytes[s[0]]
    raise ValueError


def valid_bitcount(s):
    try:
        return float(s)
    except ValueError:
        match=re.findall("([0-9\.]*) *([GMKgmk]?[Bb]?)[(?:ps)(?:PS)]?",s)[0]
        return float(match[0])*get_byte_multiplier(match[1])


def extract_data_from_json(s,max):
    csv = ""
    with open(s, 'r') as f:
        data = json.load(f)
    if max:
        for timestamp,value in data['MAX']:
            if (isinstance( value, int )):
                csv+= "\n%s,%s"%(datetime.fromtimestamp(timestamp/1000),value*1000000)
    else :
        for timestamp,value in data['AVERAGE']:
            if (isinstance( value, float )):
                csv+= "\n%s,%s"%(datetime.fromtimestamp(timestamp/1000),value*1000000)

    return csv

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--file', "-f", type=str, required=True)
    parser.add_argument('--max', dest='max', action='store_true')
    args = parser.parse_args()

    csv = extract_data_from_json(args.file,args.max)
    print(csv)

