DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
DIROUT=$(echo $DIR | sed 's/\/in/\/out/')
mkdir -p $DIROUT
echo -e "\e[32mremoving old csvx file\e[39m"
rm $DIROUT/*.csvx 2> /dev/null

echo -e "\e[32mfor each config key"
for t in `cat $1 |sed -rn 's/^(.*),(.*),(.*),(.*)$/\1/p'`; do
   echo -e "\e[32mworking with $t\e[39m"
   period=$(cat $1|grep $t|sed -r "s/.*,(.*)$/\1/g")
   echo -e "\e[32mperiod = $period\e[39m"
   for i in `ls $DIROUT/$t*.json`; do
      echo -e "\e[32mextracting $i\e[39m"   
	  adate=$(ls $i|sed -r "s/^.*--(.*)\.json/\1/g")
	  $DIR/nix.cz-data-extractor.py --file $i --date $adate >> "${DIROUT}/$t.csvx"
   done
   resolution=$(cat $1|grep $t|sed -r "s/.*,(.*),.*$/\1/g")
   echo -e "\e[32mConsolidating $t\e[39m"
   $DIR/consolidate-capture.py -f "${DIROUT}/${t}.csvx" -r ${resolution} -o "${DIROUT}/${t}_${resolution}.csvx"
   echo -e "\e[32mConsolidated $t\e[39m"
done
