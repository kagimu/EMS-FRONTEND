# build stage
FROM node:16.13.1-alpine as build-stage
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm install
RUN npm run build

# production stage
FROM nginx:1.15.7-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 8895
CMD ["nginx", "-g", "daemon off;"]
