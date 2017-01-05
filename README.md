# node_API-docker

### This repository is connected with mongodb-docker repository that can be fount in my github.

#### How to generate the docker image?

##### docker build -t guillem:myApi_image .

This command have to be run into the repository folder. The command above will generate a Docker image with the name "guillem:myApi_image".

#### How to create the Docker container?

##### docker run -p 33080:8080 --link MongoDB_server -d guillem:myApi_image

The flag --link MongoDB_server allow us to connect this Docker container with MongoDB_server. It is necessary to have the container MongoDB_server running before run this one
