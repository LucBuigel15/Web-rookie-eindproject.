async function getData() {
    const response = await fetch("products.json");
    const products = await response.json();
    const container = document.getElementById("products");

    products.forEach((product) => {
        container.innerHTML += `
            <div class="col-sm-6 col-md-4 col-lg-3 mb-4">
                <div class="card h-100">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="card-body text-center">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">€${product.price}</p>
                        <button class="btn btn-outline-success add-to-cart" data-id="${product.id}">
                            In winkelwagen
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    document.querySelectorAll(".add-to-cart").forEach((button) => {
        button.addEventListener("click", () => {
            const id = Number(button.dataset.id);
            const product = products.find((p) => p.id === id);
            addToCart(product);
        });
    });
}

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    cartBadge();
}

function cartBadge() {
    const badge = document.querySelector(".aantalProduct");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

    badge.textContent = totalQuantity;
}

const darkmodeBtn = document.querySelector(".darkmode");

function applyTheme(theme) {
    document.body.setAttribute("data-bs-theme", theme);
}

darkmodeBtn.addEventListener("click", () => {
    const current = document.body.getAttribute("data-bs-theme");
    const next = current === "dark" ? "light" : "dark";

    applyTheme(next);
    localStorage.setItem("theme", next);
});

const savedTheme = localStorage.getItem("theme") || "light";
applyTheme(savedTheme);

getData();
cartBadge();
