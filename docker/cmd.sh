#!/bin/bash
mkdir /root/.ssh/
cp /root/id_rsa /root/.ssh/id_rsa
chmod 600 /root/.ssh/id_rsa
ssh-keyscan -t rsa github.com > ~/.ssh/known_hosts
git clone --depth=1 -b withdata git@github.com:dngroup/girafe-ixp-data-extractor.git
cd girafe-ixp-data-extractor
find ./ -name "*.sh" -exec chmod +x {} \;
find ./ -name "*.py" -exec chmod +x {} \;
if [[ $# -eq 0 ]]; then
    exec /bin/bash
else
    $*
    if [ -d "/root/tohost/" ]; then 
		cp -r /root/girafe-ixp-data-extractor/ /root/tohost/
    fi
fi

