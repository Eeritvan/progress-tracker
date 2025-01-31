FROM oven/bun:slim AS build

WORKDIR /app

COPY package.json bun.lock ./

RUN bun i --frozen-lockfile

COPY . .

RUN bun run build



FROM nginx:stable-alpine-slim

WORKDIR /usr/share/nginx/html

COPY --from=build /app/dist .
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
