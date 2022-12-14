# Base image
FROM node:18

# Create app directory
WORKDIR /usr/src/trading-platform-core/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY ./trading-platform-core/package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY ./trading-platform-core .

# Creates a "dist" folder with the production build
RUN npm run build

# Generate Prisma client
RUN npx prisma generate

# Start the server using the production build
# CMD [ "node", "dist/main.js" ]

# Start the server in development mode
CMD [ "npm", "run", "dev" ]
