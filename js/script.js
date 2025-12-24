// function voor het ophalen van de producten uit de JSON en ze daarna in de localStoarrage zetten
async function getData() {
    let products = JSON.parse(localStorage.getItem("products"));

    // Kijken alsof de producten al in localStorage staan ( zoniet worden ze opgehaald uit de JSON en in localStorage gezet.)
    if (!products) {
        const response = await fetch("products.json");
        products = await response.json();
        localStorage.setItem("products", JSON.stringify(products));
    }

    const container = document.getElementById("products");
    container.innerHTML = "";

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

// Functie die ervoor zorgt dat een product in de card kan worden gezet.
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

// functie die ervoor zorgt dat wanneer producten verweiderd zijn ze ook uit de cart verdweinen
function cleanCart(products) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter((item) => products.some((p) => p.id === item.id));
    localStorage.setItem("cart", JSON.stringify(cart));
}

// functie die ervoor zorgt dat de badge boven het cart icoontje laat zien hoeveel producten er in de cart zitten
function cartBadge() {
    const badge = document.querySelector(".aantalProduct");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

    badge.textContent = totalQuantity;
}

const darkmodeBtn = document.querySelector(".darkmode");

// functie die het thema aan kan passen.
function applyTheme(theme) {
    document.body.setAttribute("data-bs-theme", theme);
}
// Arrow function die kijkt welk thema het is en daarop gebaseerd het thema veranderd naar gewild thema.
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
