import mongoose from "mongoose";

const collection = "carts";

const schema = new mongoose.Schema(
  {
    products: {
      type: [
        {
          product: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "products",
          },
          quantity: Number,
        },
      ],
      default: [],
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

schema.pre("find", function () {
  this.populate("products.product");
});

const cartstModel = mongoose.model(collection, schema);

export default cartstModel;