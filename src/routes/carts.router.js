import { Router } from "express";
import CartsManager from "../dao/fileSystem/Manager/cartsManager.js";
import ProductManager from "../dao/fileSystem/Manager/productManager.js"

const router = Router();

export default router;

const manager = new ProductManager();
const cartsManager = new CartsManager();

const products = manager.getProducts();
const carts = cartsManager.getCarts();

router.get(`/:cid`, async (req, res) => {
    try {
      const idCart = req.params.cid;
      const allCarts = await carts;
      const selected = allCarts.find((c) => c.id == idCart);
      res.send(selected);
    } catch (error) {
        console.log(error);
        return res.status(404).send({ status: "error", error: "not found" });
    }
  });

router.post(`/`, async (req, res) => {
    try {
        cartsManager.createCart();
        res.send("cart created");
    } catch (error) {
        console.log(error);
        return res.status(404).send({ status: "error", error: "cart not created" });
    }
});

router.post(`/:cId/product/:pId`, async (req, res) => {
    const allCarts = await carts;
    const idCart = req.params.cId;
    const CartExist = allCarts.find((c) => c.id == idCart);
    if (!CartExist) {
        return res.status(404).send({ status: "error", error: "cart not found" });
    }
    const idProduct = req.params.pId;
    let quantity = req.body.quantity;
    quantity ? (quantity = quantity) : (quantity = 1);
    const allProducts = await products;
    const productSelected = allProducts.find((p) => p.id == idProduct);
    productSelected
    ? res.send({ status: "succes ", code: "Product and Cart found" })
    : res.send("product not found");
    const productSelectedId = productSelected.id;
    const cartToSend = {
        product: productSelectedId,
        quantity: quantity,
    };
    cartsManager.addProductToCart(idCart, cartToSend);
});


