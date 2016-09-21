#!/bin/bash
mkdir /root/.ssh/
cp /root/id_rsa /root/.ssh/id_rsa
chmod 600 /root/.ssh/id_rsa
ssh-keyscan -t rsa github.com > ~/.ssh/known_hosts
git clone --depth=1 -b withdata git@github.com:dngroup/girafe-ixp-data-extractor.git
cd girafe-ixp-data-extractor
if [[ $# -eq 0 ]]; then
    exec /bin/bash
else
    $*
fi

