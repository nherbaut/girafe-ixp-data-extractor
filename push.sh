#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR
git add -A
date=$(date "+%Y-%m-%dT%H.%M.%S")
git tag  "$date"
git commit -a -m "save of $(date)"
git push origin $date
git push origin withdata
