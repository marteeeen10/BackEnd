import { Router } from "express";
import ProductManager from "../dao/fileSystem/Manager/productManager.js"


const router = Router();

export default router;

const manager = new ProductManager();
const products = manager.getProducts();


router.get(`/`, async (req, res) => {
    const cantidadDeProductos = req.query.limit;
    const allProducts = await products;
    if (cantidadDeProductos) {
      const reduced = allProducts.slice(0, cantidadDeProductos);
      res.send(reduced);
    } else {
      res.send(allProducts);
    }
  });
  
  router.get(`/:pid`, async (req, res) => {
    try {
        const idProducts = req.params.pid;
        const allProducts = await products;
        const selected = allProducts.find((p) => p.id == idProducts);
        res.send(selected);
    } catch (error) {
        res.status(404).send({ status: "error", error: "not found" });
    }
});

  router.post(`/`, async (req, res) => {
    try {
      const newContent = req.body;
      await manager.addProduct(newContent);
      res.send({ status: "succes", message: "product posted" });
    } catch (error) {
      res.status(404).send({ status: "error", error: "not found" });
      console.log(error);
    }
  });

  router.put(`/:pid`, async (req, res) => {
    const allProducts = await products;
    const id = req.params.pid;
    const newContent = req.body;
    const productIndex = allProducts.findIndex((p) => p.id == id);
    if (productIndex === -1) {
      return res.status(404).send({ status: "error", error: "not found" });
    }
    allProducts[productIndex] = newContent;
    manager.updateProduct(id, newContent);
    res.send({ status: "succes", message: "product updated" });
  });

  router.delete("/:pid", async (req, res) => {
    const allProducts = await products;
    const id = req.params.pid;
    const productIndex = allProducts.findIndex((p) => p.id == id);
    if (productIndex === -1) {
      return res.status(404).send({ status: "error", error: "not found" });
    }
    allProducts.splice(productIndex, 1);
    manager.deleteProduct(allProducts);
    res.send({ status: "succes", message: "product deleted" });
  });