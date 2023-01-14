# Base image
FROM node:18

# Create app directory
WORKDIR /trading-platform-core/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY ./trading-platform-core ./
# COPY ./trading-platform-core/package*.json ./

# Remove node_modules and dist
RUN rm -rf dist && rm -rf node_modules

# Install app dependencies
RUN npm install

# Bundle app source
# COPY ./trading-platform-core .

# Creates a "dist" folder with the production build
RUN npm run build

# Generate Prisma client
RUN npx prisma generate

# Start the server using the production build
# CMD [ "node", "dist/main.js" ]

# Start the server in development mode
CMD [ "npm", "run", "dev" ]