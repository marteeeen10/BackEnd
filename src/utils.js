import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import { dirname } from "path";

export const createHash = async (password) => {
  const salts = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salts);
};

export const validatePassword = (password, hashedPassword) =>
  bcrypt.compare(password, hashedPassword);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;
