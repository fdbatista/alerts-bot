git pull
sudo chown -R nico:nico docker

docker-compose down
docker-compose up -d --force-recreate --build
sleep 3

docker exec crc-alerts-service pnpm migration:run
