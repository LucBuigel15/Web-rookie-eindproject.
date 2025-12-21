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

seeOrders();
