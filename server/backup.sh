#!/bin/bash
timestamp=$(date +"%Y-%m-%d_%H:%M:%S")
#rootfolder=/var/elasticsearch_backup
#password=edgeguide
#database=fortdox
rootfolder=/opt/fortdox/backup
password=
database=FortDoks

echo "Creating backup in $rootfolder/$timestamp"

/usr/bin/curl -X PUT \
http://localhost:9200/_snapshot/fortdox_backup \
  -H 'cache-control: no-cache' \
  -d '{
	"type" : "fs",
  "settings" : {
    "location" : "'"$timestamp"'"
  }
}'

/usr/bin/curl -X PUT \
  http://localhost:9200/_snapshot/fortdox_backup/$timestamp?wait_for_completion=true \
  -H 'cache-control: no-cache' \
  -d '{
	"indices": "_all"
}'

mysqldump --user=root --password=$password $database > $rootfolder/$timestamp.sql
tar cz -C $rootfolder $timestamp.sql $timestamp > $rootfolder/$timestamp.tar.gz
rm -rf $rootfolder/$timestamp
rm $rootfolder/$timestamp.sql

echo "Finished created backup"

temp1=$(date -d "now - 2 weeks" +"%Y-%m-%d")
expired_date=$(echo "$temp1")
rm $rootfolder/$expired_date*.tar.gz
