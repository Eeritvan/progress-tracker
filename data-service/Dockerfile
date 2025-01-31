FROM golang:1.23.4-alpine3.21 AS build

WORKDIR /build
COPY . .

RUN go mod download && \
    go mod verify && \
    GOOS=linux GOARCH=amd64 go build -ldflags "-w -s -extldflags '-static -Wl,--strip-all,--gc-sections'"



FROM scratch

COPY --from=build /build/data-service /data-service
COPY --from=build /build/schema.sql /schema.sql

CMD ["/data-service"]