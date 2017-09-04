## Mallserver Produktionsserver

### Serverinformation
IP: 123.122.13.142
DNS: mall.edgeguide.se
OS: Ubuntu 14.04

#### Access:
`ssh edgeguide@123.122.13.142`
`not_8dgegu1de_or_edge.guide`

mallserver.pem-----BEGIN RSA PRIVATE KEY-----
ASDIJASLDJAKSJDLASJD
-----END RSA PRIVATE KEY-----

## För felavhjälpande underhåll

### Kända fel
* Loggfilerna kan bli enormt stora om en backendtjänst kraschar.
* Javascriptcachen släpper inte utan omstart.
* Användare utan kreditkort blir korrupta
  * Fix: 
  ```
  curl -X DELETE \
  http://localhost:8080/users/1 
  ```

### Schemalagda aktiviteter
`sudo crontab -e`
`sudo su edgeguide && crontab -e`

### Loggfiler

#### Liferay
/opt/liferay-ce-portal-7.0-ga3/tomcat-8.0.32/logs/catalina.out

#### Access
/var/log/nginx/access.log

#### Cronjob
/im/on/a/flight


### Kundspecifika förutsättningar
Alla anrop mot interna backendtjänster kan krascha, och det uppenbarar sig genom X 
