import mongoose from "mongoose";

const collection = "users";

const schema = new mongoose.Schema(
  {
    first_name: String,
    last_name: String,
    email: {
      type: String,
      unique: true,
    },
    password: String,
    role: { type: String, default: "usuario" },
  },

  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const userModel = mongoose.model(collection, schema);

export default userModel;