import express from "express";
import ProductsRouter from "./routes/products.router.js";
import CartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import ProductManager from "../src/dao/fileSystem/Manager/productManager.js";


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use("/api/products", ProductsRouter);
app.use("/api/carts", CartsRouter);
app.use("/", viewsRouter);


const server = app.listen(8080, () => console.log("escuchando en puertooo 8080"));
const io = new Server(server);

const renderRealTimeProducts = async (socket) => {
  try {
    const productManager = new ProductManager();
    const products = await productManager.getProducts();
    socket.emit("updateProducts", products);
  } catch (error) {
    console.log(error);
  }
};
io.on("connection", (socket) => {
  console.log("nuevo cliente conectadoo");
  renderRealTimeProducts(socket);
});