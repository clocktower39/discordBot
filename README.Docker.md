### Building and running your application

docker build -t discordbot .

docker run -d \
    --name discordBot \
    --env-file .env \
    --restart unless-stopped \
    -e TZ=America/Phoenix \
    -v /etc/localtime:/etc/localtime:ro \
    -v /etc/timezone:/etc/timezone:ro \
    discordbot

### References
* [Docker's Node.js guide](https://docs.docker.com/language/nodejs/)