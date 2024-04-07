npm pkg set version="$1"
docker build -t andriotisnikos1/pfs-server:$1 .
docker tag andriotisnikos1/pfs-server:$1 andriotisnikos1/pfs-server:latest
docker push andriotisnikos1/pfs-server:latest