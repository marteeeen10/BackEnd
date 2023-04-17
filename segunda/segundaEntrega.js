const fs = require('fs');
const { parse } = require('path');

class ProductManager {
    constructor() {
        this.products = [];
        this.path = './productos.json';
    };

    appendProduct = async () => {
        const toJSON = JSON.stringify(this.products,null, 2);
        await fs.promises.writeFile(this.path, toJSON)
    }
    addProduct(title, description, price, thumbnail, code, stock) {
        const product = {title, description, price, thumbnail, code, stock}

        //Validar codigos duplicados
        const validarCodigo = this.products.find(productos=> productos.code === product.code)
        if (validarCodigo) {
            return console.log('Un producto no se pudo agregar por tener el codigo repetido')
        }

        // ID autoincremental
        if(this.products.length === 0){
            product.id = 1
        }else{
            product.id = this.products[this.products.length - 1].id + 1
        }
        //Validar campos incompletos y agregar producto
        if (Object.values(product).every(obj => obj)){
            this.products.push(product)
            this.appendProduct()
        }else{
            return console.log('Campos incompletos')
        }
}
    // Listar todos los productos
    getProducts = async () => {
        try {
            const getFileProducts = await fs.promises.readFile(this.path, 'utf-8')
            const products = JSON.parse(getFileProducts)
            console.log(products)
        } 
        catch (error) {
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
        try {
            const getFileProducts = await fs.promises.readFile(this.path, 'utf-8')
            const products = JSON.parse(getFileProducts)
            const returnObject = Object.assign(products[id-1], obj)
            console.log(products[id-1])
            this.products = products
            this.appendProduct()
        } 
        catch (error) {
            console.log(error)
        }
}
    deleteProduct = async (id) => {
        try {
            const getFileProducts = await fs.promises.readFile(this.path, 'utf-8')
            const products = JSON.parse(getFileProducts)
            products.splice(id-1,1)
            this.products = products
            this.appendProduct()
        } 
        catch (error) {
            console.log(error)
        }
}
}

const manager = new ProductManager();

manager.addProduct('TV', 'TV LED 24 Pulgadas', 15000, 'tv.pjg', 101, 25)
manager.addProduct('LAVARROPA', 'Lavarropa Drean', 49500, 'lavarropa.pjg', 102, 28)
manager.addProduct('Exprimidoraaaa', 'Exprimidora Cocina', 4500, 'exprimidora.pjg', 103, 78)
// manager.getProductsById(1)
// manager.getProducts()
// manager.updateProduct(2, {"title": 'Lavarropas'})
// manager.deleteProduct(1)