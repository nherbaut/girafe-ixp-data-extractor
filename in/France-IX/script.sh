#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
DIROUT=$(echo $DIR | sed 's/\/in/\/out/')
mkdir -p $DIROUT
echo -e "\e[32mremoving old csvx file\e[39m"
rm $DIROUT/*.csvx 2> /dev/null
echo -e "\e[32mdownloading new png files\e[39m"
date=$(date "+%Y-%m-%dT%H:%M:%S")
IFS=$'\n'
SMS=0
minimumsize=200
maxloop=10
for value in `cat $1`;do

    echo wget --no-check-certificate $(echo $value | tr "," "\n" | sed -n 2p) -O $DIROUT\/$(echo $value | tr "," "\n" | sed -n 1p)--$date.png | source /dev/stdin
    actualsize=$(wc -c < $DIROUT\/$(echo $value | tr ',' '\n' | sed -n 1p)--$date.png )
    try=0
    while [ $minimumsize -ge $actualsize ];do
        echo -e "\e[93mfile empty restart\e[39m"
        echo wget --no-check-certificate $(echo $value | tr "," "\n" | sed -n 2p) -O $DIROUT\/$(echo $value | tr "," "\n" | sed -n 1p)--$date.png | source /dev/stdin
        actualsize=$(wc -c < $DIROUT\/$(echo $value | tr ',' '\n' | sed -n 1p)--$date.png )
        try=$[$try+1]
        if  [ $try -ge $maxloop ]; then
            echo -e "\e[91mcan not get the file now\e[39m"
			SMS=1
            break
        fi
    done

done
unset IFS
if [ "$SMS" = 1 ]; then  
  curl --get "https://smsapi.free-mobile.fr/sendmsg" --data "user=23122068" --data "pass=XsMJyZrJ0WF8OF" --data "msg=Error can not get FRANCE-IX" -v
fi


echo -e "\e[32mfor each config key"
for t in `cat $1 |sed -rn 's/^(.*),(.*),(.*),(.*)$/\1/p'`; do
   echo -e "\e[32mworking with $t\e[39m"
   scaleY=$(cat $1|grep $t|sed -r "s/.*,(.*),.*$/\1/g")
   period=$(cat $1|grep $t|sed -r "s/.*,(.*)$/\1/g")
   echo -e "\e[32mscale = $scaleY         period = $period\e[39m"
   for i in `ls $DIROUT/$t*.png`; do
      echo -e "\e[32mextracting $i\e[39m"   
      adate=$(ls $i|sed -r "s/^.*--(.*)\.png/\1/g")
      $DIR/franceix-data-extractor.py --file $i --date $adate --maxY $scaleY -p $period>> $DIROUT/$t.csvx
   done
   echo -e "\e[32mconsolidating $t\e[39m"
   $DIR/consolidate-capture.py -f "${DIROUT}/${t}.csvx" -r 10T -o "${DIROUT}/${t}_10T.csvx"
   $DIR/consolidate-capture.py -f "${DIROUT}/${t}.csvx" -r 1H -o "${DIROUT}/${t}_1H.csvx"
   echo -e "\e[32mconsolidated $t\e[39m"

done


