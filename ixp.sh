#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

$DIR/ixp-asm-extractor/script.sh $DIR/ixp-asm-extractor/ixp-list.csv

cd $DIR
./push.sh
