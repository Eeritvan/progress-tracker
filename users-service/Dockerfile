FROM golang:1.23.4-alpine3.21 AS build

WORKDIR /build
COPY . .

RUN go mod download && \
    go mod verify && \
    GOOS=linux GOARCH=amd64 go build -ldflags "-w -s -extldflags '-static -Wl,--strip-all,--gc-sections'"



FROM scratch

COPY --from=build /build/users-service /users-service

CMD ["/users-service"]