# Build stage
FROM node:alpine AS build
WORKDIR /react-app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:alpine AS production
WORKDIR /react-app
COPY --from=build /react-app /react-app
RUN npm install --omit=dev  # Install only production dependencies
EXPOSE 3000

CMD ["npm", "run", "start"]
