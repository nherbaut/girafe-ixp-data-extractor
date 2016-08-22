DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
echo -e "\e[32mremoving old csvx file\e[39m"
rm $DIR/*.csvx 2> /dev/null
echo -e "\e[32mdownloading new png files\e[39m"
cat $1 |sed -rn 's/^(.*),(.*),(.*),(.*)$/wget --no-check-certificate "\2" -O $DIR\/\1--$(date "+%Y-%m-%dT%H:%M:%S").png /p' | source /dev/stdin

echo -e "\e[32mfor each config key"
for t in `cat $1 |sed -rn 's/^(.*),(.*),(.*),(.*)$/\1/p'`; do
   echo -e "\e[32mworking with $t\e[39m"
   scaleY=$(cat $1|grep $t|sed -r "s/.*,(.*),.*$/\1/g")
   period=$(cat $1|grep $t|sed -r "s/.*,(.*)$/\1/g")
   echo -e "\e[32mscale = $scaleY         period = $period\e[39m"
   for i in `ls $t*.png`; do
      echo -e "\e[32mextracting $i\e[39m"   
      adate=$(ls $i|sed -r "s/^.*--(.*)\.png/\1/g")
      $DIR/franceix-data-extractor.py --file $i --date $adate --maxY $scaleY -p $period>> $t.csvx
   done
   echo -e "\e[32mconsolidating $t\e[39m"
   $DIR/consolidate-capture.py -f ${t}.csvx -r 10T -o ${t}_10T.csvx
   $DIR/consolidate-capture.py -f ${t}.csvx -r 1H -o ${t}_1H.csvx
   echo -e "\e[32mconsolidated $t\e[39m"

done


