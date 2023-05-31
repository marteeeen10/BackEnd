import { Router } from "express";
import ProductsManager from "../dao/mongo/managers/productManager.js";
import CartsManager from "../dao/mongo/managers/cartManager.js";
import productModel from "../dao/mongo/models/products.js";

const router = Router();

const productsManager = new ProductsManager();
const cartsManager = new CartsManager();

router.get("/", async (req, res) => {
  const { page = 1, sort = 1, limit = 3 } = req.query;

  const options = {
    page,
    limit: parseInt(limit),
    lean: true,
    sort: { price: sort },
  };

  const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, ...rest } =
    await productModel.paginate({}, options);

  // const result = await productModel.paginate({}, { limit: 3, lean: true });
  // console.log(result);
  const products = docs;

  res.render("home", {
    products,
    page: rest.page,
    hasPrevPage,
    hasNextPage,
    prevPage,
    nextPage,
    css: "products",
  });
});
router.get("/realTimeProducts", async (req, res) => {
  res.render("realTimeProducts", { css: "realTimeProducts" });
});

router.get("/cart", async (req, res) => {
  const carts = await cartsManager.getCarts();
  res.render("cart", { carts, css: "cart" });
});

router.get("/cart/:cid", async (req, res) => {
  const cid = req.params.cid;
  const carts = await cartsManager.getCarts();
  const cartSelected = carts.find((cart) => cart._id == cid);
  res.render("oneCart", { cartSelected, css: "cart" });
});


export default router;
