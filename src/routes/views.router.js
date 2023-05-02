import { Router } from "express";
import ProductManager from '../../Manager/productManager.js'

const router = Router();

export default router;

const manager = new ProductManager();
const products = manager.getProducts();

router.get("/", async (rec, res) => {
    const allProducts = await products;
    res.render("home", { allProducts, css: "products" });
  });
  
  router.get("/realTimeProducts", async (rec, res) => {
    res.render("realTimeProducts", { css: "realTimeProducts" });
  });

