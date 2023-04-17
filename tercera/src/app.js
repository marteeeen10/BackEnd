import express from 'express';
import ProductManager from './Manager/productManager.js'


const app = express();
const manager = new ProductManager();
const products = manager.getProducts();

app.get(`/products/`, async (req, res) => {
  const cantidadDeProductos = req.query.limit;
  const allProducts = await products;
  if (cantidadDeProductos) {
    const reduced = allProducts.slice(0, cantidadDeProductos);
    res.send(reduced);
  } else {
    res.send(allProducts);
  }
});

app.get(`/products/:pid`, async (req, res) => {
  const idProducts = req.params.pid;
  const allProducts = await products;
  const selected = allProducts.find((p) => p.id == idProducts);
  res.send(selected);
});

app.listen(8080, () => {
  console.log("Servidor escuchando en el puerto 8080");
});