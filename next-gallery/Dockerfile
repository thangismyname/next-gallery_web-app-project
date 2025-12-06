# Use official Node image
FROM node:20-bullseye

# Set working directory
WORKDIR /app

# Install dependencies for building native modules
RUN apt-get update && apt-get install -y python3 make g++ git

# Copy package files
COPY package*.json ./

# Install all dependencies (optionalDeps included)
RUN npm install

# Copy the rest of your app
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Start dev server
CMD ["npm", "run", "dev", "--", "--host"]
