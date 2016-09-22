#!/bin/bash
git remote set-branches origin '*'
git fetch
git checkout -f dev-web 
## the cmd.sh copy the /web and co to the host
