# Base image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

# Generate Prisma client
RUN npx prisma generate

# Migrate
RUN npx prisma migrate dev

# Start the server using the production build
# CMD [ "node", "dist/main.js" ]

# Start the server in development mode
CMD [ "npm", "run", "dev" ]
