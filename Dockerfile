FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/app
RUN mkdir -p /usr/src/app/config
RUN mkdir -p /usr/src/app/routes
RUN mkdir -p /usr/src/app/models
RUN mkdir -p /usr/src/app/controllers
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
COPY config/config.js /usr/src/app/config
COPY controllers/users.js /usr/src/app/controllers
COPY models/users.js /usr/src/app/models
COPY models/db.js /usr/src/app/models
RUN npm install

# Bundle app source
COPY server.js /usr/src/app

EXPOSE 8080
CMD [ "npm", "start" ]
