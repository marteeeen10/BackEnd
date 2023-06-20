import express from "express";
import ProductsRouter from "./routes/products.mongo.router.js";
import CartsRouter from "./routes/carts.mongo.router.js";
import sessionRouter from "./routes/session.router.js";
import viewsRouter from "./routes/views.router.js";
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import ProductsManager from "../src/dao/mongo/managers/productManager.js";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import session from "express-session";
import productModel from "../src/dao/mongo/models/products.js";
import messagesModel from "../src/dao/mongo/models/messages.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";

const app = express();
const connection = mongoose.connect(
  "mongodb+srv://martinpe:123@clustercomercio.eeuskzl.mongodb.net/ecommerce?retryWrites=true&w=majority"
);

app.use(
  session({
    store: new MongoStore({
      mongoUrl:
      "mongodb+srv://martinpe:123@clustercomercio.eeuskzl.mongodb.net/ecommerce?retryWrites=true&w=majority",
      ttl: 36000,
    }),
    secret: "maquinaria",
    resave: false,
    saveUninitialized: false,
  })
);

const server = app.listen(8080, () => console.log("escuchando en puertooo 8080"));
const io = new Server(server);

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

app.use(passport.initialize());
initializePassport();

app.use("/api/products", ProductsRouter);
app.use("/api/carts", CartsRouter);
app.use("/api/sessions", sessionRouter);
app.use("/", viewsRouter);

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