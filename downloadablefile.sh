#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo -e "\e[32mfor each start script\e[39m"
for t in `ls $DIR/out/`; do
    echo $t
	ls $DIR/out/$t | grep "1H.csvx" > $DIR/out/$t/download.txt
	ls $DIR/out/$t | grep "H.csvx\|T.csvx\|D.csvx" > $DIR/out/$t/alldownload.txt
done
