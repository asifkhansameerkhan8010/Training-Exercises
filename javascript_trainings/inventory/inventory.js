class Product {
    constructor(name, price, quantity) {
        this.name = name;
        this.price = price;
        this.quantity = quantity;
    }
    displayDetails() {
        return `${this.name} - Price: $${this.price}, Quantity: ${this.quantity}`;
    }
}
let inventory = [];
document.getElementById("inventory-form").addEventListener("submit", function (e) {
    e.preventDefault();
    let name = document.getElementById("name").value;
    let price = parseFloat(document.getElementById("price").value);
    let quantity = parseInt(document.getElementById("quantity").value);
    let product = new Product(name, price, quantity);
    inventory.push(product);
    displayInventory();
    document.getElementById("inventory-form").reset();
});

function displayInventory() {
    let tableBody = document.getElementById("tablebody");
    tableBody.innerHTML = "";
    inventory.forEach((product, index) => {
        let tr = document.createElement("tr");
        let tdName = document.createElement("td");
        tdName.textContent = product.name;
        tr.appendChild(tdName);
        let tdPrice = document.createElement("td");
        tdPrice.textContent = `$${product.price}`;
        tr.appendChild(tdPrice);
        let tdQuantity = document.createElement("td");
        tdQuantity.textContent = product.quantity;
        tr.appendChild(tdQuantity);
        let deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Remove";
        deleteBtn.classList.add("action-btn");
        deleteBtn.addEventListener("click", () => {
            inventory.splice(index, 1);
            displayInventory();
        });
        let actionsTd = document.createElement("td");
        actionsTd.appendChild(deleteBtn);
        tr.appendChild(actionsTd);
        tableBody.appendChild(tr);
    });
}
displayInventory();
