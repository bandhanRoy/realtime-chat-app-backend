# base image
FROM node:12.13.0 AS compile-image

RUN mkdir -p /opt/application/

COPY . /opt/application/

WORKDIR /opt/application/

RUN touch /opt/application/.env && \
    mkdir /opt/application/logs && \
    cp /opt/application/.env ./docker_env && \
    rm /opt/application/docker_env

RUN npm install 

# Start Service
CMD npm start