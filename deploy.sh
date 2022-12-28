#!/bin/bash

rm -Rf /var/lib/docker/volumes/sos_web_data/_data/*
unzip /home/ubuntu/sos_alpha/sos_api.zip -d /var/lib/docker/volumes/sos_web_data/_data/
chown -Rf www-data:www-data /var/lib/docker/volumes/sos_web_data/_data/sos_api/images/
unzip /home/ubuntu/sos_alpha/www.zip -d /var/lib/docker/volumes/sos_web_data/_data/