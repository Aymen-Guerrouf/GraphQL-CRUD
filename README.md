# GraphQL Project Management API

A GraphQL API that enables management of clients and their associated projects. The API supports full CRUD operations with MongoDB integration and relationship handling between clients and projects.

## Core Features

- **Client Operations**
  - Query single client by ID
  - Query all clients
  - Add new clients
  - Delete clients with cascade deletion of associated projects

- **Project Operations**
  - Query single project by ID
  - Query all projects
  - Add new projects with client association
  - Update project details and status
  - Delete projects
  - Automatic client relationship resolution

## Schema Structure

### Types

#### Client Type
```graphql
type Client {
  id: String
  name: String
  email: String
  phone: String
}
```

#### Project Type
```graphql
type Project {
  id: ID
  name: String
  description: String
  status: String
  client: Client
}
```

### Project Status Options
- Not Started
- In Progress
- Done

## API Operations

### Queries

#### Get All Clients
```graphql
{
  clients {
    id
    name
    email
    phone
  }
}
```

#### Get Single Client
```graphql
{
  client(id: "clientId") {
    id
    name
    email
    phone
  }
}
```

#### Get All Projects
```graphql
{
  projects {
    id
    name
    description
    status
    client {
      name
    }
  }
}
```

#### Get Single Project
```graphql
{
  project(id: "projectId") {
    id
    name
    description
    status
    client {
      name
    }
  }
}
```

### Mutations

#### Add Client
```graphql
mutation {
  addClient(name: "John Doe", email: "john@email.com", phone: "123-456-7890") {
    id
    name
    email
    phone
  }
}
```

#### Delete Client
```graphql
mutation {
  deleteClient(id: "clientId") {
    id
    name
  }
}
```

#### Add Project
```graphql
mutation {
  addProject(
    name: "Website Project"
    description: "Website development project"
    status: NOT_STARTED
    clientId: "clientId"
  ) {
    id
    name
    description
    status
  }
}
```

#### Update Project
```graphql
mutation {
  updateProject(
    id: "projectId"
    name: "Updated Website Project"
    status: IN_PROGRESS
  ) {
    id
    name
    status
  }
}
```

#### Delete Project
```graphql
mutation {
  deleteProject(id: "projectId") {
    id
    name
  }
}
```

## Technical Stack

- Node.js
- Express
- GraphQL
- MongoDB with Mongoose
- GraphQL Schema Type Definitions

## Project Setup

1. Clone the repository
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
Create a `.env` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

4. Start the server
```bash
npm start
```

## Dependencies

```json
{
  "dependencies": {
    "express": "^4.x.x",
    "express-graphql": "^0.12.x",
    "graphql": "^15.x.x",
    "mongoose": "^6.x.x",
    "dotenv": "^10.x.x"
  }
}
```

## Error Handling

The API implements comprehensive error handling for:
- Database operation failures
- Invalid client/project IDs
- Missing required fields
- Relationship constraints

## License

MIT

## Author

Guerrouf Aymen

---
Feel free to contribute to this project by submitting issues or pull requests.
