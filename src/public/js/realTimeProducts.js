const socket = io();

socket.on("updateProducts", (products) => {
    const productContainer = document.getElementById("product-container");
    productContainer.innerHTML = "";
  
    products.forEach((product) => {
      const productDiv = document.createElement("div");
      productDiv.innerHTML = `
            <div class="cardContainer">
              <h2>${product.title}</h2>
              <div class="imgConteiner" >
              <img  src="${product.thumbnail}" alt="${product.title}">
              </div>
              <p class="description">${product.description}</p>
              <p class="price">$ ${product.price}</p>
            </div>
            
          `;
      productContainer.appendChild(productDiv);
    });
  });
  
  console.log("conectado");