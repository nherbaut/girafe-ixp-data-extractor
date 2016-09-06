#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR
git status
git add -A
git commit -a -m "save of $(date)"

git status
