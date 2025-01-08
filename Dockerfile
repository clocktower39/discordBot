# Use Node.js 18 on Alpine
FROM node:18-alpine

# Install everything needed to build native modules, including linux-headers for i2c
RUN apk add --no-cache python3 make g++ linux-headers

# Set the working directory inside the container
WORKDIR /app

# Copy package files first for better caching
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install --frozen-lockfile

# Copy all remaining files into the container
COPY . .

# No port exposed because it's a Discord bot
# EXPOSE 3000

# Start the bot
CMD ["yarn", "start"]
