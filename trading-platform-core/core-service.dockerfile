# # Base image
# FROM node:18

# # Create app directory
# WORKDIR /app

# # Remove node_modules and dist
# RUN rm -rf dist && rm -rf node_modules

# # A wildcard is used to ensure both package.json AND package-lock.json are copied
# COPY . ./
# # COPY ./package*.json ./

# # Install app dependencies
# RUN npm install

# # Bundle app source
# # COPY . .

# # Generate Prisma client
# RUN npx prisma generate

# # Creates a "dist" folder with the production build
# RUN npm run build

###

# Base image
FROM node:18

# Create app directory
WORKDIR /app

# Remove node_modules and dist
RUN rm -rf dist && rm -rf node_modules

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY . ./
# COPY ./package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
# COPY . .

# Generate Prisma client
RUN npx prisma generate

# Creates a "dist" folder with the production build
RUN npm run build