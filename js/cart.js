const cartContainer = document.getElementById("cart");
const totalContainer = document.getElementById("total");
const orderBtn = document.getElementById("orderBtn");
const orderMessage = document.getElementById("orderMessage");

function renderCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartContainer.innerHTML = "";

    let total = 0;

    cart.forEach((item) => {
        total += item.price * item.quantity;

        cartContainer.innerHTML += `
            <div class="card mb-3">
                <div class="card-body d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center gap-3">
                        <img src="${item.image}" style="width:80px;">
                        <div>
                            <h5>${item.name}</h5>
                            <p class="mb-0">€${item.price}</p>
                        </div>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                    <button class="btn " onclick="changeQuantity(${item.id}, -${item.quantity})"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
</svg></button>
                        <button class="btn btn-outline-secondary" onclick="changeQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="btn btn-outline-secondary" onclick="changeQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
            </div>
        `;
    });

    totalContainer.textContent = `Totaal: €${total.toFixed(2)}`;
}

function changeQuantity(id, change) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart = cart
        .map((item) => {
            if (item.id === id) item.quantity += change;
            return item;
        })
        .filter((item) => item.quantity > 0);

    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

orderBtn.addEventListener("click", () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) return;

    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    orders.push({
        id: Date.now(),
        items: cart,
        date: new Date().toLocaleString(),
    });

    localStorage.setItem("orders", JSON.stringify(orders));
    localStorage.removeItem("cart");

    renderCart();
    orderMessage.textContent = "Ordered ✅";

    const modal = new bootstrap.Modal(document.getElementById("staticBackdrop"));
    modal.show();
});

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

renderCart();
