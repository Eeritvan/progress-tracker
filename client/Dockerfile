FROM oven/bun:slim AS build

WORKDIR /app

COPY package.json bun.lock ./

RUN bun i --frozen-lockfile

ENV VITE_USERS_SVC=http://localhost:8080/query \
    VITE_DATA_SVC=http://localhost:8081/query

COPY . .

RUN bun run build



FROM nginx:stable-alpine-slim

WORKDIR /usr/share/nginx/html

COPY --from=build /app/dist .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]