DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
DIROUT=$(echo $DIR | sed 's/\/in/\/out/')
mkdir -p $DIROUT
echo -e "\e[32mremoving old csvx file\e[39m"
rm $DIROUT/*.csvx 2> /dev/null
echo -e "\e[32mdownloading new json files\e[39m"
cat $1 |sed -rn 's/^(.*),(.*),(.*),(.*)$/wget --no-check-certificate "\2" -O $DIROUT\/\1--$(date "+%Y-%m-%dT%H:%M:%S").json /p' | source /dev/stdin


