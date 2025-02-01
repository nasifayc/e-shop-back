import gql from "graphql-tag";

const typeDefs = gql`
  type AuthPayload {
    token: String!
    user: User!
  }

  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Product {
    id: ID!
    name: String!
    price: Float!
    description: String!
  }

  type Favorite {
    id: ID!
    user: User!
    product: Product!
  }

  type Query {
    getUsers: [User]
    getUser(id: ID!): User
    getProducts: [Product]
    getProduct(id: ID!): Product
  }

  type Mutation {
    register(user: RegisterUserInput!): AuthPayload!
    signin(user: SigninInput!): AuthPayload!
    addProduct(product: AddProductInput!): Product
    updateProduct(id: ID!, product: UpdateProductInput!): Product
    deleteProduct(id: ID!): Product
  }

  input RegisterUserInput {
    name: String!
    email: String!
    password: String!
  }

  input SigninInput {
    email: String!
    password: String!
  }

  input AddProductInput {
    name: String!
    price: Float!
    description: String!
  }

  input UpdateProductInput {
    name: String
    price: Float
    description: String
  }
`;

export default typeDefs;
