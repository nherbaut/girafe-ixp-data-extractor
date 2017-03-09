# girafe-ixp-data-extractor

## manual

```
./extract.sh #get all data and push it
./compile.sh  # compile data
./docker/webupdate.sh # get last update from master to apache
./ixp.sh # get ixp information
cp -r /var/www/girafe-data/out /var/www/girafe-data/web 
```

## use Crontab

``` bash
# m h  dom mon dow   command
# SALT_CRON_IDENTIFIER:extract
0 */4 * * * docker run  --rm -v /root/.ssh/id_rsa:/root/id_rsa dngroup/girafe-ixp-data-extractor ./extract.sh >>/var/log/girafe/extract 2>&1
# SALT_CRON_IDENTIFIER:compile
30 1 * * * docker run  --rm  -v /root/.ssh/id_rsa:/root/id_rsa -v /var/www/girafe-data:/root/tohost/girafe-ixp-data-extractor dngroup/girafe-ixp-data-extractor ./compile.sh >>/var/log/girafe/compile 2>&1
# SALT_CRON_IDENTIFIER:webupdate
30 2 * * * docker run  --rm -v /root/.ssh/id_rsa:/root/id_rsa -v /var/www/girafe-data:/root/tohost/girafe-ixp-data-extractor dngroup/girafe-ixp-data-extractor ./docker/webupdate.sh >>/var/log/girafe/webupdate 2>&1
# SALT_CRON_IDENTIFIER:mv out folder
30 3 * * * cp -r /var/www/girafe-data/out /var/www/girafe-data/web >>/var/log/girafe/mv 2>&1
# SALT_CRON_IDENTIFIER:peeringdb extractor
0 2 * * * docker run  --rm  -v /root/.ssh/id_rsa:/root/id_rsa dngroup/girafe-ixp-data-extractor ./ixp.sh >>/var/log/girafe/peeringdb 2>&1

```
