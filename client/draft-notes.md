
docker exec -it react-node-backend sh
docker exec -it react-node-frontend sh
# Build stage
FROM node:alpine AS build
WORKDIR /react-app
COPY ./package*.json /react-app/
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:stable-alpine AS production
COPY --from=build /react-app/.next /usr/share/nginx/html
COPY --from=build /react-app/public /usr/share/nginx/html

EXPOSE 80
EXPOSE 8092

CMD ["nginx", "-g", "daemon off;"]


docker run -e FBI_WANTED_API_URL=xxx wanted-backend:latest
