# Base image
FROM node:18

# Create app directory
WORKDIR /trading-platform-auth/usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY ./trading-platform-auth/package*.json ./

# Install app dependencies
RUN npm install

# Migrate
RUN npx prisma migrate dev

# Bundle app source
COPY ./trading-platform-auth .

# Creates a "dist" folder with the production build
RUN npm run build

# Start the server using the production build
# CMD [ "node", "dist/main.js" ]

# Start the server in development mode
CMD [ "npm", "run", "dev" ]
