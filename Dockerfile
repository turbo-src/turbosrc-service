# We start from a Node.js 16 image. You can adjust this to your project's needs
FROM node:12

# Create app directory
WORKDIR /app

# Install app dependencies
# We're copying both package.json AND package-lock.json. If you don't use lock files, you might not have the latter
COPY package*.json ./

# If you have production-specific dependencies, you can use --only=production
# Also, using `npm ci` to install dependencies for more reliable and reproducible builds.
RUN npm ci

# Bundle app source
COPY . .

# Your app starts with "node server.js", so we'll use that
CMD [ "node", "server.js" ]

# Expose the port that your app runs on. Adjust this if you're using a different port
EXPOSE 4000