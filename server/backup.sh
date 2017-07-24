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
