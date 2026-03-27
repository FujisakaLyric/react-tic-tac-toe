ARG NODE_VERSION=24
FROM node:${NODE_VERSION}-slim

WORKDIR /app

# Install node modules
COPY package*.json ./
RUN npm ci

# Copy application code
COPY . .
RUN npm run build

# Ensure the "node" user owns the application files
RUN chown -R node:node /app
 
# Switch to the built-in non-root "node" user
USER node

# Start the server by default, this can be overwritten at runtime
EXPOSE 5173
CMD [ "npm", "run", "preview", "--", "--host", "--port", "5173"]