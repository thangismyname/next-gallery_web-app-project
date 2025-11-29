FROM node:20-bullseye
WORKDIR /app
# Install Sharp + HEIC dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    pkg-config \
    libvips-dev \
    libheif-dev \
    libde265-dev \
    bash \
    && rm -rf /var/lib/apt/lists/*

# Copy package.json first for caching
COPY package*.json ./

# Install node dependencies
RUN npm install

# Copy rest of the code
COPY . .

# Expose port
EXPOSE 3001

# Start server
CMD ["npm", "run", "dev"]
