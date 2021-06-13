# FROM alpine:3.13

# # Create app directory
# WORKDIR /usr/src/app

# # ENV STATIC_IP=10.0.0.11

# # Install app dependencies
# # A wildcard is used to ensure both package.json AND package-lock.json are copied
# # where available (npm@5+)
# # COPY package*.json ./

# # RUN npm install && npm install typescript -g
# # If you are building your code for production
# # RUN npm ci --only=production

# ADD /start.sh /
# # RUN chmod +x /start.sh && /start.sh
# # CMD chmod +x /start.sh && /start.sh
# RUN chmod +x /start.sh 
# ENTRYPOINT /start.sh


# Bundle app source
# COPY . .

# Compile typescript files
# RUN npm run build
# WORKDIR ./dist

# EXPOSE 8080
# CMD node test3d.js
# CMD node app.js


# ------------------------------

# FROM ubuntu
# RUN apt-get update \
#         && apt-get install -y net-tools iputils-ping
# COPY /start.sh /
# RUN chmod +x /start.sh 
# ENTRYPOINT /start.sh
