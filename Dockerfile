# docker pull node:19.4.0-alpine
FROM node:19.4.0-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# RUN npm install
# If you are building your code for production
RUN npm ci --only=production --ignore-scripts

# Bundle app source
COPY . .

ENV NODE_ENV=production

EXPOSE 3001

ENTRYPOINT npm run start