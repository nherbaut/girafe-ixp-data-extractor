#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
DIROUT=$(echo $DIR | sed 's/\/in/\/out/')
mkdir -p $DIROUT
echo -e "\e[32mremoving old csvx file\e[39m"
rm $DIROUT/*.csvx 2> /dev/null
echo -e "\e[32mdownloading new json files\e[39m"
date=$(date "+%Y-%m-%dT%H:%M:%S")
IFS=$'\n'
SMS=0
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
			SMS=1
            break
        fi
    done

done
unset IFS
if [ "$SMS" -eq 1 ]
  curl --get "https://smsapi.free-mobile.fr/sendmsg" --data "user=23122068" --data "pass=XsMJyZrJ0WF8OF" --data "msg=Error can not get ECIX" -v
fi
