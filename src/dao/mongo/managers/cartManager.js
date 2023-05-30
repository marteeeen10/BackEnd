import mongoose from "mongoose";
import cartsModel from "../models/carts.js";
import productModel from "../models/products.js";

export default class CartsManager {
  getCarts = (params) => {
    return cartsModel.find(params).lean();
  };

  getCartById = (param) => {
    return cartsModel.findById(param);
  };

  createCart = (cart) => {
    return cartsModel.create(cart);
  };

  addProductToCart = async (cid, pid) => {
    try {
      // Obtén el carrito correspondiente al ID (cid)
      let cart = await cartsModel.findById(cid);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      // Busca el índice del producto en el arreglo de productos
      const existingProductIndex = cart.products.findIndex(
        (product) => product.product == pid
      );
      if (existingProductIndex !== -1) {
        // Si el producto ya existe en el carrito, incrementa la cantidad en 1
        cart.products[existingProductIndex].quantity += 1;
      } else {
        // Si el producto no existe en el carrito, agrégalo al arreglo de productos
        cart.products.push({ product: pid, quantity: 1 });
      }
      // Guarda los cambios en la base de datos
      cart = await cart.save();
      return cart;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  deleteProductToCart = async (cid, pid) => {
    try {
      let cart = await cartsModel.findById(cid);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      console.log(cart.products);
      const existingProductIndex = cart.products.findIndex(
        (product) => product.product == pid
      );
      if (existingProductIndex !== -1) {
        // Elimina el producto del arreglo de productos del carrito
        cart.products.splice(existingProductIndex, 1);
      } else {
        // Si el producto no existe en el carrito, avisame
        throw new Error("producto no encontrado");
      }
      cart = await cart.save();
    } catch (error) {
      throw new Error(error.message);
    }
  };
  deleteCart = async (cid) => {
    try {
      const deletedCart = await cartsModel.findByIdAndDelete(cid);

      if (!deletedCart) {
        throw new Error("Carrito no encontrado");
      }

      return deletedCart;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  updateProductInCart = async (cid, pid, newQuantity) => {
    try {
      const cartToUpdate = await cartsModel.findById(cid);
      if (!cartToUpdate) {
        throw new Error("Carrito no encontrado");
      }
      const existingProductIndex = cartToUpdate.products.findIndex(
        (product) => product.product == pid
      );
      if (existingProductIndex === -1) {
        throw new Error("Producto no encontrado en el carrito");
      }
      console.log(cartToUpdate.products[existingProductIndex]);

      const product = cartToUpdate.products[existingProductIndex].product;

      cartToUpdate.products[existingProductIndex] = {
        product: product,
        quantity: newQuantity.quantity,
      };

      const updatedCart = await cartToUpdate.save();
      return updatedCart;
    } catch (error) {
      console.log(error);
    }
  };
}