#!/bin/bash
git remote set-branches origin '*'
git fetch
git checkout -f master
## the cmd.sh copy the /web and co to the host
