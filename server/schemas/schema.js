const Client = require("../models/Client");
const Project = require("../models/Projects");

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLEnumType,
  GraphQLNonNull,
} = require("graphql");

//client type
const ClientType = new GraphQLObjectType({
  name: "Client",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  }),
});

//project type
const ProjectType = new GraphQLObjectType({
  name: "Project",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    client: {
      // a project BELONGS to a client
      type: ClientType,
      resolve(project) {
        return Client.findById(project.clientId);
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    client: {
      type: ClientType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Client.findById(args.id);
      },
    },
    clients: {
      type: new GraphQLList(ClientType),
      resolve(parent, args) {
        return Client.find();
      },
    },
    project: {
      type: ProjectType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Project.findById(args.id);
      },
    },
    projects: {
      type: new GraphQLList(ProjectType),
      resolve(parent, args) {
        return Project.find();
      },
    },
  },
});
// creating an enum for project status

const ProjectStatusEnum = new GraphQLEnumType({
  name: "ProjectStatus",
  values: {
    NOT_STARTED: { value: "Not Started" },
    IN_PROGRESS: { value: "In Progress" },
    COMPLETED: { value: "Done" },
  },
});

// mutation

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    // Add Client
    addClient: {
      type: ClientType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        phone: { type: GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, args) {
        try {
          const client = new Client({
            name: args.name,
            email: args.email,
            phone: args.phone,
          });
          return await client.save();
        } catch (error) {
          throw new Error(`Failed to add client: ${error.message}`);
        }
      },
    },

    // Delete Client
    deleteClient: {
      type: ClientType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      async resolve(parent, args) {
        try {
          const client = await Client.findById(args.id);
          if (!client) {
            throw new Error("Client not found");
          }

          // Delete associated projects first
          await Project.deleteMany({ clientId: args.id });

          // Delete the client
          return await Client.findByIdAndDelete(args.id);
        } catch (error) {
          throw new Error(`Failed to delete client: ${error.message}`);
        }
      },
    },

    // Add Project Mutation
    addProject: {
      type: ProjectType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        status: {
          type: ProjectStatusEnum,
          defaultValue: "Not Started",
        },
        clientId: { type: GraphQLNonNull(GraphQLID) },
      },
      async resolve(parent, args) {
        try {
          // Verify client exists before creating project
          const client = await Client.findById(args.clientId);
          if (!client) {
            throw new Error("Client not found");
          }

          const project = new Project({
            name: args.name,
            description: args.description,
            status: args.status,
            clientId: args.clientId,
          });
          return await project.save();
        } catch (error) {
          throw new Error(`Failed to add project: ${error.message}`);
        }
      },
    },

    // Delete Project Mutation
    deleteProject: {
      type: ProjectType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      async resolve(parent, args) {
        try {
          const project = await Project.findById(args.id);
          if (!project) {
            throw new Error("Project not found");
          }
          return await Project.findByIdAndDelete(args.id);
        } catch (error) {
          throw new Error(`Failed to delete project: ${error.message}`);
        }
      },
    },

    // Update Project Mutation (Added as it was missing)
    updateProject: {
      type: ProjectType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: ProjectStatusEnum },
      },
      async resolve(parent, args) {
        try {
          const project = await Project.findById(args.id);
          if (!project) {
            throw new Error("Project not found");
          }

          return await Project.findByIdAndUpdate(
            args.id,
            {
              $set: {
                name: args.name || project.name,
                description: args.description || project.description,
                status: args.status || project.status,
              },
            },
            { new: true }
          );
        } catch (error) {
          throw new Error(`Failed to update project: ${error.message}`);
        }
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: mutation,
});
