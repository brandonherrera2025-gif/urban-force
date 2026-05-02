const products = [
    {
        id: 1,
        name: "Camiseta Elite",
        price: 30000,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"
    },
    {
        id: 2,
        name: "Hoodie Street",
        price: 50000,
        image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1"
    },
    {
        id: 3,
        name: "Chaqueta Urban",
        price: 60000,
        image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c"
    }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const productGrid = document.getElementById("product-grid");
const cartItems = document.getElementById("cart-items");
const totalElement = document.getElementById("total");
const cartCount = document.getElementById("cart-count");

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function renderProducts() {
    productGrid.innerHTML = "";

    products.forEach(product => {
        productGrid.innerHTML += `
            <div class="product">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>$${product.price.toLocaleString()}</p>
                <button onclick="addToCart(${product.id})">Agregar</button>
            </div>
        `;
    });
}

function addToCart(id) {
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        const product = products.find(p => p.id === id);
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCart();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCart();
}

function changeQuantity(id, amount) {
    const item = cart.find(item => item.id === id);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        removeFromCart(id);
        return;
    }

    saveCart();
    updateCart();
}

function updateCart() {
    cartItems.innerHTML = "";

    let total = 0;
    let count = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Tu carrito está vacío</p>";
    }

    cart.forEach(item => {
        total += item.price * item.quantity;
        count += item.quantity;

        cartItems.innerHTML += `
            <div class="cart-item">
                <h4>${item.name}</h4>
                <p>$${item.price.toLocaleString()}</p>

                <div class="quantity-controls">
                    <button onclick="changeQuantity(${item.id}, -1)">−</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity(${item.id}, 1)">+</button>
                </div>

                <button class="remove-btn" onclick="removeFromCart(${item.id})">
                    Eliminar
                </button>
            </div>
        `;
    });

    totalElement.textContent = total.toLocaleString();
    cartCount.textContent = count;
}

function toggleCart() {
    document.getElementById("cart").classList.toggle("active");
}

renderProducts();
updateCart();
function showCheckout() {
    if(cart.length === 0){
        alert("Tu carrito está vacío");
        return;
    }

    document.getElementById("checkout-form").style.display = "block";
}
async function confirmOrder() {
    const nombre = document.getElementById("nombre").value;
    const direccion = document.getElementById("direccion").value;
    const telefono = document.getElementById("telefono").value;

    if (!nombre || !direccion || !telefono) {
        alert("Completa todos los campos");
        return;
    }

    const order = {
        nombre,
        direccion,
        telefono,
        productos: cart
    };

    try {
        const response = await fetch("http://localhost:3000/api/order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(order)
        });

        const data = await response.json();

        if (data.success) {
            alert("Pedido enviado correctamente");

            cart = [];
            saveCart();
            updateCart();

            document.getElementById("checkout-form").style.display = "none";
        }

    } catch (error) {
        alert("Error al enviar pedido");
        console.error(error);
    }
}