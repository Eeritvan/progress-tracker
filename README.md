## Table of Content
- [The App](#the-app)
- [Tech Used](#tech-used)
- [Project Structure](#project-structure)
- [Installation](#Installation)
    - [Local](#local)
    - [Docker Compose](#docker-compose)
    - [Kubernetes](#kubernetes)

## The App
A simple progress tracking app with the following features:
- User authentication (register & login)
- Progress tracking
  - Create and manage trackable items
  - Customize items with icons and colors
  - Reorder items via drag-and-drop
- Customization
  - Multiple theme support

## Tech Used
- The frontend is made with Vite and React
- The backend consists of two Go microservices:
    - users-service for user accounts 
    - data-service for storing data
- Both microservices have their own PostgreSQL databases for storing data
- Each service communicates via GraphQL

rough highlevel overview of the application:
```
C4Context
    title Progress tracking application
    Boundary(app, "The application") {
        System(client, "Frontend")

        Boundary(microservices, "Microservices") {
            System(users-svc, "Users Service", "Microservice responsible of authentication and account data")
            System(data-svc, "Data Service", "Microservice responsible of all the data and data transfers")
            Boundary(databases, "DBs") {
                SystemDb(users-db, "users-database", "A PostgreSQL database to store all the users")
                SystemDb(data-db, "data-database", "A PostgreSQL database to store all the data")
            }
        }
    BiRel(users-svc, users-db, "uses")
    BiRel(data-svc, data-db, "Uses")
    BiRel(client, users-svc, "GraphQL")
    BiRel(client, data-svc, "GraphQL")
}

```

## Project Structure
- `client/` - React frontend application
- `data-service/` - Go microservice for data management
- `users-service/` - Go microservice for user authentication

## Installation
### Prerequisites
- Node.js 18+ for frontend
- Go 1.24.3+ for backend services
- PostgreSQL databases for each service
### Local
- todo
### Docker Compose
- todo
### Kubernetes
- todo