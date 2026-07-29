ARG GO_VERSION=1.26.4
ARG ALPINE_VERSION=3.23

# build frontend
FROM node:24-alpine AS frontend-build

WORKDIR /app

COPY frontend/package*.json  ./
RUN npm ci

COPY frontend .

RUN npm run build


# build backend
FROM golang:${GO_VERSION}-alpine${ALPINE_VERSION} AS backend-build

WORKDIR /build

COPY backend/go.mod backend/go.sum ./
RUN go mod download && go mod verify

COPY backend .
COPY --from=frontend-build /app/dist ./dist

RUN adduser -D -H -g '' -u 10001 nonroot

ARG BUILD_MODE=prod
RUN if [ "$BUILD_MODE" = "prod" ]; then \
        CGO_ENABLED=0 GOOS=linux GOARCH=amd64 GOEXPERIMENT=jsonv2 \
        go build -ldflags="-w -s -extldflags '-static -Wl,--strip-all,--gc-sections'" -o server; \
    else \
        CGO_ENABLED=0 GOOS=linux GOARCH=amd64 GOEXPERIMENT=jsonv2 \
        go build -tags=dev -ldflags="-w -s -extldflags '-static -Wl,--strip-all,--gc-sections'" -o server; \
    fi


# final stage
# TODO: replace with scratch
FROM alpine

COPY --from=backend-build /build/server /server
COPY --from=backend-build /etc/passwd /etc/passwd

USER nonroot

CMD ["/server"]
