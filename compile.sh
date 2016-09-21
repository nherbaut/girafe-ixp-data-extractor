#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo -e "\e[32mfor each start script\e[39m"
for t in `ls $DIR/in`; do
		$DIR/in/$t/compile.sh $DIR/in/$t/target.csv $DIR/in/$t/ixplist.csv
done


