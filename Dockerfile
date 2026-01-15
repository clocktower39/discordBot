# Use Node.js 18 on Alpine
FROM node:24-alpine

# Install required packages
RUN apk add --no-cache python3 make g++ linux-headers tzdata

# Set timezone to match Arizona Mountain Time
ENV TZ=America/Phoenix
RUN cp /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Set the working directory
WORKDIR /app

# Copy and install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy all remaining files
COPY . .

# Start the bot
CMD ["yarn", "start"]
