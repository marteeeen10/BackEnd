import express from "express";
import ProductsRouter from "./routes/products.mongo.router.js";
import CartsRouter from "./routes/carts.mongo.router.js";
import viewsRouter from "./routes/views.router.js";
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import ProductsManager from "../src/dao/mongo/managers/productManager.js";
import mongoose from "mongoose";
import productModel from "../src/dao/mongo/models/products.js";
import messagesModel from "../src/dao/mongo/models/messages.js";


const app = express();
const connection = mongoose.connect(
  "mongodb+srv://martinpe:123@clustercomercio.eeuskzl.mongodb.net/ecommerce?retryWrites=true&w=majority"
);

app.use((req, res, next) => {
  req.io = io;
  next();
});

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

io.on("connection", async (socket) => {
  console.log("nuevo cliente conectado");
  const productManager = new ProductsManager();
  const products = await productManager.getProducts();
  socket.emit("updateProducts", products);
});

const messages = [];

io.on("connection", async (socket) => {
  console.log("Nuevo clienteeee conectado");
  try {
    // Obtén todos los mensajes existentes desde MongoDB
    const messages = await messagesModel.find({}).lean().exec();
    socket.emit("logs", messages);
  } catch (error) {
    console.error("Error al obtener mensajes desde MongoDB:", error);
  }
  socket.on("message", async (data) => {
    try {
      // Crea un nuevo documento en MongoDB con el mensaje recibido
      const message = await messagesModel.create(data);
      // Agrega el nuevo mensaje al array en memoria
      messages.push(message);
      // Emite los mensajes actualizados a todos los clientes conectados
      io.emit("logs", messages);
    } catch (error) {
      console.error("Error al crear el mensaje en MongoDB:", error);
    }
  });
  socket.on("authenticated", (data) => {
    socket.broadcast.emit("newUserConnected", data);
  });
});

//viejo
/* const renderRealTimeProducts = async (socket) => {
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
}); */