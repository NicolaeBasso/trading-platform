# Base image
FROM node:18

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY . /

# Install app dependencies
RUN npm install

# Creates a "dist" folder with the production build
RUN npm run build

# Generate Prisma client
RUN npx prisma generate

# Run migration
# RUN npm run migrate

# Start the server using the production build
# CMD [ "node", "dist/main.js" ]

# Start the server in development mode
# CMD [ "npm", "run", "migrate:dev" ]
CMD [ "npm", "run", "dev" ]