import User from "../models/User.js";
import Product from "../models/Product.js";
import { generateToken } from "../utils/generateTokens.js";
import { GraphQLError } from "graphql";

const resolvers = {
  Query: {
    getUsers: async () => await User.find(),
    getProducts: async () => await Product.find(),
    getProduct: async (_, args) => {
      return await Product.findById(args.id);
    },
  },

  Mutation: {
    register: async (_, args) => {
      const { name, email, password } = args.user;
      // console.log(`User name: ${name} Email: ${email} Password: ${password}`);
      try {
        if (!name || !email || !password) {
          throw new GraphQLError("All fields are required", {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new GraphQLError("User already exists with this email", {
            extensions: { code: "USER_ALREADY_EXISTS" },
          });
        }
        const newUser = new User({
          name,
          email,
          password,
        });

        await newUser.save();
        const token = generateToken(newUser);
        return {
          token,
          user: newUser,
        };
      } catch (err) {
        console.log("registration error: " + err.messages);
        throw new GraphQLError(
          "Failed to register the user. Please try again later.",
          {
            extensions: { code: "INTERNAL_SERVER_ERROR", error: err.message },
          }
        );
      }
    },

    signin: async (_, args) => {
      const { email, password } = args.user;
      try {
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
          throw new GraphQLError("Invalid email or password", {
            extensions: { code: "INVALID_CREDENTIALS" },
          });
        }

        const token = generateToken(user);
        return {
          token,
          user,
        };
      } catch (err) {
        console.log("login error: " + err.messages);
        throw new GraphQLError(err.message);
      }
    },

    addProduct: async (_, args) => {
      const { name, price, description } = args.product;
      if (!name || !price || !description) {
        throw new GraphQLError("All Fields Are Required");
      }

      if (price < 0) {
        throw new GraphQLError("Price should be greater than or equal to 0");
      }

      const newProduct = new Product({
        name,
        price,
        description,
      });

      await newProduct.save();
      return newProduct;
    },

    updateProduct: async (_, args) => {
      const { id } = args;
      console.log("ID: " + id);
      const product = await Product.findByIdAndUpdate(
        id,
        {
          ...args.product,
        },
        { new: true }
      );

      if (!product) {
        throw new GraphQLError("Product not found");
      }
      return product;
    },

    deleteProduct: async (_, args) => {
      const { id } = args;
      console.log("ID: " + id);
      const deletedProduct = await Product.findByIdAndDelete(id);
      if (!deletedProduct) {
        throw new GraphQLError("Product not found");
      }
      return deletedProduct;
    },
  },
};

export default resolvers;
