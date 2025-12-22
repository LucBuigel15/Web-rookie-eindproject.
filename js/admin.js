// Dark mode.

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

// Functie om orders te laten zien.
function seeOrders() {
    const list = document.querySelector(".list-group");
    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    list.innerHTML = "";

    if (orders.length === 0) {
        list.innerHTML = `<li class="list-group-item">Geen orders</li>`;
        return;
    }

    orders.forEach((order) => {
        let itemsHtml = "";
        let orderTotal = 0;

        order.items.forEach((item) => {
            const itemTotal = item.price * item.quantity;
            orderTotal += itemTotal;
            itemsHtml += `
                <div class="d-flex justify-content-between">
                    <span>${item.name} x ${item.quantity}</span>
                    <span>€${itemTotal.toFixed(2)}</span>
                </div>
            `;
        });

        list.innerHTML += `
            <li class="list-group-item">
                <strong>Order #${order.id}</strong><br>
                <small>${order.date}</small>
                <hr>
                ${itemsHtml}
                <hr>
                <strong>Totaal: €${orderTotal.toFixed(2)}</strong>
            </li>
        `;
    });
}

let products = [];

// Functie om producten te laten zien die momenteel op de website staan.
async function loadProducts() {
    const response = await fetch("products.json");
    products = await response.json();
    renderTable();
}

function renderTable() {
    const tbody = document.querySelector("#productTable tbody");
    tbody.innerHTML = "";

    products.forEach((product) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <th scope="row">${product.id}</th>
            <td>${product.name}</td>
            <td>€${product.price.toFixed(2)}</td>
            <td><img src="${product.image}" alt="${product.name}" width="50"></td>
            <td>${product.category}</td>
        `;
        tbody.appendChild(tr);
    });
}

document.getElementById("addProduct").addEventListener("click", () => {
    const name = document.getElementById("name").value;
    const price = parseFloat(document.getElementById("price").value);
    const image = document.getElementById("image").value;

    if (!name || !isFinite(price) || !image) {
        alert("Vul alle velden correct in!");
        return;
    }

    const newProduct = {
        id: products.length + 1,
        name,
        price,
        image,
        category: "Onbekend",
    };

    products.push(newProduct);
    renderTable();

    document.getElementById("name").value = "";
    document.getElementById("price").value = "";
    document.getElementById("image").value = "";
});

document.getElementById("resetProducts").addEventListener("click", () => {
    loadProducts();
});

async function changeProduct() {
    await loadProducts();
    console.log(products);

    const select = document.querySelector(".changeProduct");
    select.innerHTML = "";

    products.forEach((product) => {
        select.innerHTML += `
            <option value="${product.id}">${product.name}</option>
        `;
    });
}

changeProduct();
loadProducts();
seeOrders();
