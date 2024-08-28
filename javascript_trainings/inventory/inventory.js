class Product {
    constructor(name, price, quantity) {
        this.name = name;
        this.price = price;
        this.quantity = quantity;
    }
}

let inventory = [];
function start(e) {
    e.preventDefault();
    let name = document.getElementById("name").value;
    let price = parseFloat(document.getElementById("price").value);
    let quantity = parseInt(document.getElementById("quantity").value);

    let product = new Product(name, price, quantity);
    inventory.push(product);

    displayInventory();
    document.getElementById("inventory-form").reset();
}

function displayInventory() {
    let tableBody = document.getElementById("tablebody");
    tableBody.innerHTML = ""; 

    inventory.forEach((product, index) => {
        tableBody.innerHTML += `
            <tr>
                <td>${product.name}</td>
                <td>$${product.price}</td>
                <td><input type="number" value="${product.quantity}" style="width: 60px; border: none;" disabled></td>
                <td class="actionsTd">
                    <button class="action-btn edit-btn" onclick="editProduct(${index})">Edit</button>
                    <button class="action-btn save-btn" onclick="saveProduct(${index})" style="display: none;">Save</button>
                    <button class="action-btn" onclick="removeProduct(${index})">Remove</button>
                </td>
            </tr>
        `;
    });
    console.log(inventory);
}

function editProduct(index) {
    let editBtn = document.getElementsByClassName("edit-btn")[index];
    let saveBtn = document.getElementsByClassName("save-btn")[index];
    let quantityInput = document.querySelectorAll("#tablebody input[type='number']")[index];

    editBtn.style.display = "none";
    saveBtn.style.display = "inline";
    quantityInput.disabled = false;
    console.log(inventory);
}

function saveProduct(index) {
    let saveBtn = document.getElementsByClassName("save-btn")[index];
    let editBtn = document.getElementsByClassName("edit-btn")[index];
    let quantityInput = document.querySelectorAll("#tablebody input[type='number']")[index];

    inventory[index].quantity = parseInt(quantityInput.value);

    saveBtn.style.display = "none";
    editBtn.style.display = "inline";
    quantityInput.disabled = true;

    displayInventory();
}

function removeProduct(index) {
    inventory.splice(index, 1);
    displayInventory();
}

displayInventory();
