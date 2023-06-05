import { Router } from "express";
import ProductsManager from "../dao/mongo/managers/productManager.js";
import productModel from "../dao/mongo/models/products.js";

const router = Router();

export default router;

const productsManager = new ProductsManager();

router.get("/", async (req, res) => {
  const { page = 1 } = req.query;
  const {
    docs,
    totalPages,
    hasPrevPage,
    hasNextpage,
    prevPage,
    nextPage,
    ...rest
  } = await productModel.paginate({}, { page, limit: 3, lean: true });
  const products = docs;
  console.log(products);
  req.io.emit("updateProducts", products);
  res.send({
    status: "succes",
    payload: products,
    totalPages: totalPages,
    prevPage: prevPage,
    nextPage: nextPage,
    page: page,
    hasPrevPage: hasPrevPage,
    hasNextPage: hasNextpage,
  });
});

router.post("/", async (req, res) => {
  const { title, description, thumbnail, code, price, status, category } =
    req.body;

  if (
    !title ||
    !description ||
    !thumbnail ||
    !code ||
    !price ||
    !status ||
    !category
  )
    return res
      .status(400)
      .send({ status: "error", error: "Incomplete Values" });

  const product = {
    title,
    description,
    thumbnail,
    code,
    price,
    status,
    category,
  };

  const result = await productsManager.createProduct(product);
  const products = await productsManager.getProducts();
  req.io.emit("updateProducts", products);

  res.sendStatus(201);
});

router.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  const products = await productsManager.getProductsBy({ _id: pid });
  if (!products)
    res.status(404).send({ status: "error", error: "product not found" });
  res.send({ status: "succes", payload: products });
});

router.put("/:pid", async (req, res) => {
  const { pid } = req.params;
  const updateProduct = req.body;
  const result = await productsManager.updateproduct(pid, updateProduct);
  const products = await productsManager.getProducts();
  req.io.emit("updateProducts", products);

  res.sendStatus(201);
});

router.delete("/:pid", async (req, res) => {
  const { pid } = req.params;

  await productsManager.deleteProduct(pid);
  const products = await productsManager.getProducts();
  req.io.emit("updateProducts", products);

  res.sendStatus(410);
});