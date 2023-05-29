import fs from 'fs'


export default class ProductManager {
    constructor() {
        //this.products = [];
        //this.path = './src/Manager/productos.json';
        this.path = './productos.json';
    };

    appendProduct = async () => {
        const toJSON = JSON.stringify(this.products,null, 2);
        await fs.promises.writeFile(this.path, toJSON)

    }
    addProduct = async ({title, description, price, thumbnail, code, stock, category, status}) => {
        try {
            const products = await this.getProducts();
            const product = {title, description, price, thumbnail, code, stock, category, status}
            if ((!title || !description || !price || !code || !stock || !category || !status)) {
                console.log("complete todos los camposssss");
                return null;
            }
            //Validar codigos duplicados
            const validarCodigo = products.find((productos)=> productos.code === code)
            if (validarCodigo) {
            console.log('Un producto no se pudo agregar por tener el codigo repetido');
            return null;
            }
            // ID autoincremental
            if(products.length === 0){
                product.id = 1
                }else{
                product.id = products[products.length - 1].id + 1
                }
                products.push(product)
                fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"));
                //this.appendProduct()
        } catch (error) {
            console.log(error)
        }
        
}
    // Listar todos los productos
    getProducts = async () => {
        try {
        const data = fs.existsSync(this.path);
        if (data) {
            const getFileProducts = await fs.promises.readFile(this.path, 'utf-8')
            const products = JSON.parse(getFileProducts)
            return products
        }else {
            console.log("leyendo desde pmanager");
            return [];
        } 
        } catch (error) {
            console.log(error)
        }
    }

    // Listar producto segun ID requerido.
    getProductsById = async (id) =>{
        try {
            const getFileProduct = await fs.promises.readFile(this.path, 'utf-8')
            const product = JSON.parse(getFileProduct)
            const validarId = product.find(productos=> productos.id === id)
            if (!validarId) return console.log('Not Found Id');
            console.log(product[id-1])
        }
        catch (error) {
            console.log(error)
        }
    }

    updateProduct = async (id, obj) => {
        console.log(id, obj);
        try {
            const products = await this.getProducts();
            const newProduct = products.map((p) =>
            p.id == id ? { ...p, ...obj } : p);
            fs.promises.writeFile(this.path, JSON.stringify(newProduct, null, "\t"));
        } 
        catch (error) {
            console.log(error)
        }
}
    deleteProduct = async (id) => {
        try {
            const products = await this.getProducts();
            fs.promises.writeFile(this.path, JSON.stringify(id, null, "\t"));
        } 
        catch (error) {
            console.log(error)
        }
}
}

//const manager = new ProductManager();

//manager.addProduct('TV', 'TV LED 24 Pulgadas', 15000, 'TV', 101, 25, 'Hogar', 'True')
//manager.addProduct('LAVARROPA', 'Lavarropa Drean', 49500, [], 102, 28, 'Hogar', 'True')
//manager.addProduct('Exprimidoraaaa', 'Exprimidora Cocina', 4500, [], 103, 728, 'Hogar', 'True')
//manager.addProduct('Jueguera', 'Juguera chica', 14500, [], 104, 758, 'Hogar', 'True')
//manager.addProduct('Batidora', 'Batidora Cocina', 45400, [], 105, 768, 'Hogar', 'True')
//manager.addProduct('Lavavajillas', 'Lavavajillas Cocina', 47500, [], 106, 785, 'Hogar', 'True')
//manager.addProduct('Secador Pelo', 'Secador de pelo', 45080, [], 107, 728, 'Hogar', 'True')
//manager.addProduct('Tv Full Led', 'Tv full Sony', 47500, [], 108, 738, 'Hogar', 'True')
//manager.addProduct('Secadora', 'Secadora ropa', 45500, [], 109, 778, 'Hogar', 'True')
//manager.addProduct('Mapeadora', 'Trapo limpieza', 45200, [], 110, 578, 'Hogar', 'True')
// manager.getProductsById(1)
// manager.getProducts()
// manager.updateProduct(2, {"title": 'Lavarropas'})
// manager.deleteProduct(1)