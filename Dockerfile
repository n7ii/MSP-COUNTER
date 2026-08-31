# Stage 1: Build application
FROM node:20.10.0-alpine AS build
WORKDIR /app

# Install dependencies required for Bun installation (curl and bash)
RUN apk add --no-cache curl bash

# Install Bun via the official script (requires bash)
RUN curl -fsSL https://bun.sh/install | bash

# Add Bun to the PATH
ENV PATH="/root/.bun/bin:$PATH"

# Copy source code and environment file
COPY . .
COPY .env.prod .env

# Install dependencies and build with Bun
RUN bun install
RUN bun run build

# Stage 2: Serve the application
FROM nginx:alpine AS production
WORKDIR /app
ENV TZ=Asia/Vientiane
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
