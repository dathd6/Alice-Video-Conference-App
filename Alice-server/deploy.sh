#!/bin/bash

echo What should the version be?
read VERSION

sudo docker build -t hddhoangducdat/alice:$VERSION .
sudo docker push hddhoangducdat/alice:$VERSION
ssh root@128.199.248.212 "docker pull hddhoangducdat/alice:$VERSION && docker tag hddhoangducdat/alice:$VERSION dokku/alice-server:$VERSION && dokku deploy alice-server $VERSION"