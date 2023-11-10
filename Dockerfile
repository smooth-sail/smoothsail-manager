FROM node:20.9.0-bullseye-slim

LABEL version="1.0"
LABEL description="Docker image for the SmoothSail Manager app"

# Use production node environment by default.
ENV NODE_ENV production

WORKDIR /app

# Copy package.json and package-lock.json into image.
COPY package*.json .

# Install dependencies
RUN npm install

# Run the application as a non-root user for security.
USER node

# Copy rest of source files into the image.
COPY . .

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application.
CMD npm start
