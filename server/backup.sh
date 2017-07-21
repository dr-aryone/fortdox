curl -X DELETE http://localhost:9200/_snapshot/fortdox_backup/snapshot

curl -X PUT \
  http://localhost:9200/_snapshot/fortdox_backup/snapshot \
  -H 'cache-control: no-cache' \
  -H 'postman-token: d95648fa-1c87-885a-7087-70ebb5d79885' \
  -d '{
	"indices": "_all"
}'
