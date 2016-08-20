rm *.csvx
cat /home/admin/data2/target.csv |sed -rn 's/^(.*),(.*),(.*)$/wget --no-check-certificate "\2" -O \/home\/admin\/data2\/\1-$(date "+%Y-%m-%dT%H:%M:%S").png -q/p' | source /dev/stdin

for t in `ls *.png | sed -r "s/^([a-z]{2})-([a-z0-9]{1,5})-.*$/\1-\2/p"|uniq`; do
scaleY=$(cat target.csv|grep $t|sed -r "s/.*,(.*)$/\1/g")
   for i in `ls $t*.png`; do
   adate=$(ls $i|sed -r "s/[a-z]{1,2}-[a-z0-9]{1,5}-(.*)\.png/\1/g")
   ./franceix-data-extractor.py --file $i --date $adate --maxY $scaleY >> $t.csvx
   echo "extracted $i"
   done
   echo "consolidating $t"
   ./consolidate-capture.py -f ${t}.csvx -r 10T -o ${t}_10T.csvx
   ./consolidate-capture.py -f ${t}.csvx -r 1H -o ${t}_1H.csvx
   echo "consolidated $t"

done


