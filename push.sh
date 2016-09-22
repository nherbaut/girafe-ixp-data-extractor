#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR








git config --global user.email dbourasseau@viotech.net
git checkout withdata
git pull origin withdata
git add -A
date=$(date "+%Y-%m-%dT%H.%M.%S")
git commit -a -m "save of $(date)"
git tag  "$date"

git push origin $date
git push origin withdata
