FROM node:20-alpine AS builder
WORKDIR /app

# Install deps (including dev for build)
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# Install only production deps
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Copy compiled output
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/index.js"]
