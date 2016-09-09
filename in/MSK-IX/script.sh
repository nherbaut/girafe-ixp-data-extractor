#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
DIROUT=$(echo $DIR | sed 's/\/in/\/out/')
mkdir -p $DIROUT
echo -e "\e[32mremoving old csvx file\e[39m"
rm $DIROUT/*.csvx 2> /dev/null
echo -e "\e[32mdownloading new json files\e[39m"
cat $1 |sed -rn 's/^(.*),(.*),(.*),(.*)$/wget --no-check-certificate "\2" -O $DIROUT\/\1--$(date "+%Y-%m-%dT%H:%M:%S").json /p' | source /dev/stdin

echo -e "\e[32mfor each config key"
for t in `cat $1 |sed -rn 's/^(.*),(.*),(.*),(.*)$/\1/p'`; do
   echo -e "\e[32mworking with $t\e[39m"
   period=$(cat $1|grep $t|sed -r "s/.*,(.*)$/\1/g")

   echo -e "\e[32mperiod = $period\e[39m"
   if [ "$period" == "366D" ];then 
      echo -e "\e[32mfor max value\e[39m"
      for i in `ls $DIROUT/$t*.json`; do
         echo -e "\e[32mextracting $i\e[39m"   
	     $DIR/msk-ix-data-extractor.py --file $i --max >> "${DIROUT}/$t-max.csvx"
      done
      echo -e "\e[32mend of max value\e[39m"
   fi
   for i in `ls $DIROUT/$t*.json`; do
      echo -e "\e[32mextracting $i\e[39m"   
	  $DIR/msk-ix-data-extractor.py --file $i >> "${DIROUT}/$t.csvx"
   done
   resolution=$(cat $1|grep $t|sed -r "s/.*,(.*),.*$/\1/g")
   
   if [ "$period" == "366D" ];then 
      echo -e "\e[32mfor max value\e[39m"
      echo -e "\e[32mConsolidating $t\e[39m"
      $DIR/consolidate-capture.py -f "${DIROUT}/${t}-max.csvx" -r ${resolution} -o "${DIROUT}/${t}_max_${resolution}.csvx"
      echo -e "\e[32mConsolidated $t\e[39m"
      echo -e "\e[32mend of max value\e[39m"
   fi
   
   echo -e "\e[32mConsolidating $t\e[39m"
   $DIR/consolidate-capture.py -f "${DIROUT}/${t}.csvx" -r ${resolution} -o "${DIROUT}/${t}_${resolution}.csvx"
   echo -e "\e[32mConsolidated $t\e[39m"
done
