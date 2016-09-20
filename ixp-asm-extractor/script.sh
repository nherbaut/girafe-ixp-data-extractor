#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
#echo -e "\e[32mremoving old csvx file\e[39m"
#rm $DIR/*.csvx 2> /dev/null
#echo -e "\e[32mGet list of IXP\e[39m"
#cat $1 |sed -rn 's/^(.*),(.*),(.*)$/\1/p'
DATE=$(date "+%Y-%m-%dT%H:%M:%S")

echo -e "\e[32mfor each config key"
for t in `cat $1 |sed -rn 's/^(.*),(.*),(.*)$/\2/p'`; do
   name=$(cat $1 |grep ",$t," |sed -rn 's/^(.*),(.*),(.*)$/\1/p')
   org=$(cat $1 |grep ",$t," |sed -rn 's/^(.*),(.*),(.*)$/\3/p')
   echo -e "\e[32mworking with $name ($t) from $org\e[39m"
   DIROUT=$(echo $DIR | sed 's/\/ixp-asm-extractor//')
   mkdir -p "${DIROUT}/out/${org}/"
   if [ -z "$2" ] ;then
      $DIR/ixp-asm-extractor.py --ixp ${t} --out "${DIROUT}/out/${org}/${name}.svg" --cache-file "${DIROUT}/out/${org}/${name}.temp" $2 $3
   else
      $DIR/ixp-asm-extractor.py --ixp ${t} --out "${DIROUT}/out/${org}/${name}.svg" --cache-file "${DIROUT}/out/${org}/${name}-$DATE.temp" $2 $3
      cp "${DIROUT}/out/${org}/${name}-$DATE.temp" "${DIROUT}/out/${org}/${name}.temp"
   fi
   echo -e "\e[32mFinish for $name \e[39m"
done


