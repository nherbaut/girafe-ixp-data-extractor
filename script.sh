#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo -e "\e[32mfor each start script\e[39m"
for t in `ls $DIR/in`; do
	if ls $DIR/in/$t/ixplist.csv 1> /dev/null 2>&1 ;then
		$DIR/in/$t/script.sh $DIR/in/$t/target.csv $DIR/in/$t/ixplist.csv
	else
		$DIR/in/$t/script.sh $DIR/in/$t/target.csv
	fi

done

./downloadablefile.sh
