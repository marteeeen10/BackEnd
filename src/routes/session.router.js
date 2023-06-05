import { Router } from "express";
import UserManager from "../dao/mongo/managers/users.js";

const router = Router();

const userManager = new UserManager();

router.post("/register", async (req, res) => {
  const result = userManager.createUsers(req.body);
  res.send({ status: "succes", payload: result });
});

router.post("/login", async (req, res) => {
  //buscar el usuario
  const { email, password } = req.body;
  const user = await userManager.getUsersBy({ email, password });
  console.log(user);
  if (!user) {
    return res
      .status(400)
      .send({ status: "error ", error: "usuario no encontrado" });
  }
  if (email === "adminCoder@coder.com" && password === "123456") {
    // si es el usuario administrador
    req.session.user = {
      name: "Coder Admin",
      email: user.email,
      role: "admin",
    };
  } else {
    // si es un usuario normal
    req.session.user = {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      role: "usuario",
    };
  }
  res.send({ status: "succes" });
});

router.post("/logout", (req, res) => {
  // Destruye la sesión
  req.session.destroy((err) => {
    if (err) {
      console.error("Error al destruir la sesión:", err);
      return res
        .status(500)
        .send({ status: "error", error: "Error al cerrar sesión" });
    }

    res.sendStatus(200);
  });
});
export default router;