const darkmodeBtn = document.querySelector(".darkmode");
const productTableBody = document.querySelector("#productTable tbody");

let products = JSON.parse(localStorage.getItem("products")) || [];

// Dark mode
darkmodeBtn.addEventListener("click", () => {
    const theme = document.body.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
    document.body.setAttribute("data-bs-theme", theme);
    localStorage.setItem("theme", theme);
});

const savedTheme = localStorage.getItem("theme") || "light";
document.body.setAttribute("data-bs-theme", savedTheme);

// Function om orders op te halen
function seeOrders() {
    const list = document.querySelector(".list-group");
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    list.innerHTML = "";

    if (!orders.length) {
        list.innerHTML = "<li class='list-group-item'>Geen orders</li>";
        return;
    }

    orders.forEach((order) => {
        let total = 0;
        let items = "";

        order.items.forEach((item) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            items += `<div class="d-flex justify-content-between">
                <span>${item.name} x ${item.quantity}</span>
                <span>€${itemTotal.toFixed(2)}</span>
            </div>`;
        });

        list.innerHTML += `
            <li class="list-group-item">
                <strong>Order #${order.id}</strong><br>
                <small>${order.date}</small>
                <hr>
                ${items}
                <hr>
                <strong>Totaal: €${total.toFixed(2)}</strong>
            </li>
        `;
    });
}

// Function voor inladen van producten en die dan in de localStorage te zetten.
async function loadProducts() {
    if (!products.length) {
        const response = await fetch("products.json");
        products = await response.json();
        localStorage.setItem("products", JSON.stringify(products));
    }
    renderProducts();
}

// Render products in table
function renderProducts() {
    productTableBody.innerHTML = "";

    products.forEach((product) => {
        productTableBody.innerHTML += `
            <tr>
                <th>${product.id}</th>
                <td>${product.name}</td>
                <td>€${product.price.toFixed(2)}</td>
                <td><img src="${product.image}" width="50"></td>
                <td>
                    <button class="btn btn-danger btn-sm deleteProduct" data-id="${product.id}">
                        Verwijderen
                    </button>
                    <button class="btn btn-outline-secondary btn-sm editProduct"
                        data-id="${product.id}"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal">
                        Edit
                    </button>
                </td>
            </tr>
        `;
    });

    document.querySelectorAll(".deleteProduct").forEach((button) => {
        button.addEventListener("click", () => {
            const id = Number(button.dataset.id);
            products = products.filter((p) => p.id !== id);
            localStorage.setItem("products", JSON.stringify(products));
            renderProducts();
        });
    });
}

// Product toevoegen.
document.getElementById("addProduct").addEventListener("click", () => {
    const name = document.getElementById("name").value;
    const price = Number(document.getElementById("price").value);
    const image = document.getElementById("image").value;

    if (!name || !price || !image) return alert("Vul alles in");

    products.push({
        id: products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1,
        name,
        price,
        image,
        category: "Onbekend",
    });

    localStorage.setItem("products", JSON.stringify(products));
    renderProducts();
});

// Arrow functiom om de producten te resetten (Info uit de JSON opnieuw ophalen en die dan weer in de localStorage zetten.)
document.getElementById("resetProducts").addEventListener("click", async () => {
    localStorage.removeItem("products");
    const response = await fetch("products.json");
    products = await response.json();
    localStorage.setItem("products", JSON.stringify(products));
    renderProducts();
});

let currentEditId = null;

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("editProduct")) {
        currentEditId = Number(e.target.dataset.id);
        const product = products.find((p) => p.id === currentEditId);

        document.querySelector(".productName").textContent = product.name;
        document.getElementById("editName").value = product.name;
        document.getElementById("editPrice").value = product.price;
        document.getElementById("editImage").value = product.image;
        document.getElementById("imagePreview").src = product.image;
    }
});

document.getElementById("editImage").addEventListener("input", (e) => {
    document.getElementById("imagePreview").src = e.target.value;
});

document.getElementById("saveEdit").addEventListener("click", () => {
    if (currentEditId === null) return;

    const name = document.getElementById("editName").value;
    const price = Number(document.getElementById("editPrice").value);
    const image = document.getElementById("editImage").value;

    if (!name || !price || !image) {
        alert("Vul alles in");
        return;
    }

    const product = products.find((p) => p.id === currentEditId);
    product.name = name;
    product.price = price;
    product.image = image;

    localStorage.setItem("products", JSON.stringify(products));
    renderProducts();

    const modal = bootstrap.Modal.getInstance(document.getElementById("exampleModal"));
    modal.hide();
});

loadProducts();
seeOrders();
