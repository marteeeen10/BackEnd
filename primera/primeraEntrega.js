
class ProductManager {
    constructor() {
    this.products = [];
    };

addProduct(title, description, price, thumbnail, code, stock) {
    const producto = {title, description, price, thumbnail, code, stock}

    //Validar codigos duplicados
    const validarCodigo = this.products.find(productos=> productos.code === producto.code)
    if (validarCodigo) {
        return console.log('Un producto no se pudo agregar por tener el codigo repetido')
    }

    //Validar campos incompletos
    if((!title||!description || !price || !thumbnail || !code || !stock)){
        return console.log('Producto incompletoo')
    }

        
    // ID autoincremental
    if(this.products.length === 0){
        producto.id = 1
    }
    else{
        producto.id = this.products.length + 1
    }

    // Agregar producto

    this.products.push(producto)

}
// Listar todos los productos
getProducts(){
    console.log(this.products);
}

// Listar producto segun ID requerido.
getProductsById(id){
    const validarId = this.products.find(productos=> productos.id === id)
    if (validarId) {
        return console.log(this.products[id-1])
    }
    else{
        return console.log('Not found')
    }
}
}

const manager = new ProductManager();

manager.addProduct('TV', 'TV LED 24 Pulgadas', 15000, 'tv.pjg', 101, 25)
manager.addProduct('Lavarropa', 'Lavarropa Drean', 49500, 'lavarropa.pjg', 102, 28)
manager.addProduct('Exprimidorassss', 'Exprimidora Cocina', 4500, 'exprimidora.pjg', 103, 68)
// manager.getProductsById(1)
// manager.getProducts()