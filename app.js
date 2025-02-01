import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import typeDefs from "./graphql/schema.js";
import resolvers from "./graphql/resolvers.js";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startServer() {
  await server.start();

  app.use("/graphql", expressMiddleware(server));

  app.use("*", (req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

startServer();
