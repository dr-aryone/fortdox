timestamp=$(date +"%Y-%m-%d_%H:%M:%S")

/usr/bin/curl -X PUT \
http://localhost:9200/_snapshot/fortdox_backup/ \
  -H 'cache-control: no-cache' \
  -d '{
	"type" : "fs",
  "settings" : {
    "location" : "'"$timestamp"'"
  }
}'

/usr/bin/curl -X PUT \
  http://localhost:9200/_snapshot/fortdox_backup/$timestamp \
  -H 'cache-control: no-cache' \
  -d '{
	"indices": "_all"
}'

mysqldump --user=root --password=edgeguide fortdox > /var/mysql_backup/$timestamp.sql

temp1=$(date -d "now - 2 weeks" +"%Y-%m-%d")
expired_date=$(echo "$temp1")
rm -r /var/elasticsearch_backup/$expired_date*
rm /var/mysql_backup/$expired_date*
