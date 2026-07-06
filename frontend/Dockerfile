FROM node:20-alpine AS builder
WORKDIR /app

ARG VITE_SERVER_URL
ENV VITE_SERVER_URL=$VITE_SERVER_URL

# install deps
COPY package.json package-lock.json* ./
RUN npm ci

# build
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# FIX 1: Explicitly fix permissions for Render's non-root environment
RUN chmod -R 755 /usr/share/nginx/html

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
