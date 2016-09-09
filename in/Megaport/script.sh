#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
DIROUT=$(echo $DIR | sed 's/\/in/\/out/')
mkdir -p $DIROUT
echo -e "\e[32mremoving old csvx file\e[39m"
rm $DIROUT/*.csvx 2> /dev/null
echo -e "\e[32mdownloading new json files\e[39m"
date=$(date "+%Y-%m-%dT%H:%M:%S")
IFS=$'\n'
minimumsize=200
maxloop=10
for value in `cat $1`;do

    echo wget --no-check-certificate $(echo $value | tr "," "\n" | sed -n 2p) -O $DIROUT\/$(echo $value | tr "," "\n" | sed -n 1p)--$date.json | source /dev/stdin
    actualsize=$(wc -c < $DIROUT\/$(echo $value | tr ',' '\n' | sed -n 1p)--$date.json )
    try=0
    while [ $minimumsize -ge $actualsize ];do
        echo -e "\e[93mfile empty restart\e[39m"
        echo wget --no-check-certificate $(echo $value | tr "," "\n" | sed -n 2p) -O $DIROUT\/$(echo $value | tr "," "\n" | sed -n 1p)--$date.json | source /dev/stdin
        actualsize=$(wc -c < $DIROUT\/$(echo $value | tr ',' '\n' | sed -n 1p)--$date.json )
        try=$[$try+1]
        if  [ $try -ge $maxloop ]; then
            echo -e "\e[91mcan not get the file now\e[39m"
            curl --get "https://smsapi.free-mobile.fr/sendmsg" --data "user=23122068" --data "pass=XsMJyZrJ0WF8OF" --data "msg=Error can not get Megaport" -v
            break
        fi
    done

done
unset IFS
#cat $1 |sed -rn 's/^(.*),(.*),(.*),(.*)$/wget --no-check-certificate "\2" -O $DIROUT\/\1--$(date "+%Y-%m-%dT%H:%M:%S").json /p' | source /dev/stdin

echo -e "\e[32mfor each config key"
for t in `cat $1 |sed -rn 's/^(.*),(.*),(.*),(.*)$/\1/p'`; do
   echo -e "\e[32mworking with $t\e[39m"
   period=$(cat "$1"|grep "$t"|sed -r "s/.*,(.*)$/\1/g")
   echo -e "\e[32mperiod = $period\e[39m"
   for i in `ls $DIROUT/$t*.json`; do
      echo -e "\e[32mextracting $i\e[39m"   
	  $DIR/Megaport-data-extractor.py --file $i >> "${DIROUT}/$t-out.csvx"
	  $DIR/Megaport-data-extractor.py --file $i --in>> "${DIROUT}/$t-in.csvx"
   done
   resolution=$(cat $1|grep $t|sed -r "s/.*,(.*),.*$/\1/g")
   echo -e "\e[32mconsolidating $t\e[39m"
   $DIR/consolidate-capture.py -f "${DIROUT}/${t}-in.csvx" -r ${resolution} -o "${DIROUT}/${t}-in_${resolution}.csvx"
   $DIR/consolidate-capture.py -f "${DIROUT}/${t}-out.csvx" -r ${resolution} -o "${DIROUT}/${t}-out_${resolution}.csvx"
   echo -e "\e[32mconsolidated $t\e[39m"
done
