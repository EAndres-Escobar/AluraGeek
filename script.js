document.addEventListener("DOMContentLoaded", () => {
  const productForm = document.getElementById("productForm");
  const previewContainer = document.getElementById("imagePreview");
  const clearButton = document.getElementById("clearButton");  // Botón de limpiar

  const API_URL = "http://localhost:3000/products"; // URL de tu API local

  // Cargar productos existentes desde la API
  async function loadProducts() {
    try {
      const response = await fetch(API_URL);
      const products = await response.json();
      products.forEach((product) => {
        addProductToPreview(product);
      });
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  }

  // Agregar producto al contenedor de previsualización
  function addProductToPreview(product) {
    const productCard = document.createElement("div");
    productCard.classList.add("card");

    const imgElement = document.createElement("img");
    imgElement.src = product.image;

    const infoContainer = document.createElement("div");
    infoContainer.classList.add("info");
    infoContainer.innerHTML = `
      <p><strong>${product.name}</strong></p>
      <br>
      <p>Precio: $${product.price}</p>
    `;

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-btn");
    deleteButton.textContent = "Eliminar";

    deleteButton.addEventListener("click", async () => {
      try {
        await fetch(`${API_URL}/${product.id}`, {
          method: "DELETE",
        });
        previewContainer.removeChild(productCard);
      } catch (error) {
        console.error("Error al eliminar producto:", error);
      }
    });

    productCard.appendChild(imgElement);
    productCard.appendChild(infoContainer);
    productCard.appendChild(deleteButton);

    previewContainer.appendChild(productCard);
  }

  // Manejar envío del formulario
  productForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("productName").value;
    const price = document.getElementById("productPrice").value;
    const imageFile = document.getElementById("productImage").files[0];

    if (imageFile) {
      const reader = new FileReader();
      reader.onload = async function (event) {
        const newProduct = {
          name,
          price,
          image: event.target.result,
        };

        try {
          const response = await fetch(API_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newProduct),
          });

          const savedProduct = await response.json();
          addProductToPreview(savedProduct);
          productForm.reset();
        } catch (error) {
          console.error("Error al guardar producto:", error);
        }
      };

      reader.readAsDataURL(imageFile);
    }
  });

  // Agregar funcionalidad al botón Limpiar
  clearButton.addEventListener("click", () => {
    productForm.reset();  // Restablecer el formulario
  });

  // Inicializar
  loadProducts();
});
