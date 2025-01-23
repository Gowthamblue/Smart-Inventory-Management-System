// Sample inventory data
const inventory = [
    { name: 'Laptop', quantity: 10, price: 800 },
{ name: 'Smartphone', quantity: 15, price: 500 },
{ name: 'Tablet', quantity: 8, price: 300 },
{ name: 'Headphones', quantity: 20, price: 150 },
{ name: 'Smartwatch', quantity: 12, price: 250 },
{ name: 'Camera', quantity: 5, price: 1000 },
{ name: 'Television', quantity: 7, price: 1200 },
{ name: 'Gaming Console', quantity: 6, price: 450 },
{ name: 'Refrigerator', quantity: 4, price: 1800 },
{ name: 'Microwave', quantity: 10, price: 250 },
{ name: 'Washing Machine', quantity: 3, price: 1300 },
{ name: 'Vacuum Cleaner', quantity: 8, price: 350 },
{ name: 'Blender', quantity: 15, price: 100 },
{ name: 'Air Conditioner', quantity: 5, price: 1600 },
{ name: 'Dishwasher', quantity: 4, price: 1400 },
{ name: 'Electric Kettle', quantity: 20, price: 80 },
{ name: 'Toaster', quantity: 12, price: 60 },
{ name: 'Iron', quantity: 10, price: 70 },
{ name: 'Hair Dryer', quantity: 18, price: 90 },
{ name: 'Air Purifier', quantity: 7, price: 400 },
{ name: 'Water Heater', quantity: 6, price: 600 },
{ name: 'Ceiling Fan', quantity: 14, price: 200 },
{ name: 'Sofa', quantity: 3, price: 2500 },
{ name: 'Dining Table', quantity: 4, price: 1800 },
{ name: 'Office Chair', quantity: 8, price: 300 },
{ name: 'Bookshelf', quantity: 9, price: 220 },
{ name: 'Desk Lamp', quantity: 25, price: 50 },
{ name: 'Floor Lamp', quantity: 7, price: 180 },
{ name: 'Rug', quantity: 6, price: 300 },
{ name: 'Mirror', quantity: 8, price: 120 }

];

// Populate inventory table
window.onload = function() {
    const inventoryTable = document.getElementById('inventory-table').getElementsByTagName('tbody')[0];
    const itemSelect = document.getElementById('item');
    
    inventory.forEach((item, index) => {
        const row = inventoryTable.insertRow();
        row.insertCell(0).textContent = item.name;
        row.insertCell(1).textContent = item.quantity;
        row.insertCell(2).textContent = `$${item.price}`;

        // Populate item selection dropdown
        const option = document.createElement('option');
        option.value = index;
        option.textContent = item.name;
        itemSelect.appendChild(option);
    });
};

// Invoice related variables
let invoiceItems = [];
let totalAmount = 0;

// Add item to invoice
function addItemToInvoice() {
    const itemIndex = document.getElementById('item').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    
    const selectedItem = inventory[itemIndex];

    if (quantity > selectedItem.quantity) {
        alert('Not enough stock!');
        return;
    }

    const invoiceTable = document.getElementById('invoice-table').getElementsByTagName('tbody')[0];
    const row = invoiceTable.insertRow();
    row.insertCell(0).textContent = selectedItem.name;
    row.insertCell(1).textContent = quantity;
    row.insertCell(2).textContent = `$${selectedItem.price}`;
    row.insertCell(3).textContent = `$${selectedItem.price * quantity}`;

    // Update total amount
    totalAmount += selectedItem.price * quantity;
    document.getElementById('total-amount').textContent = `Total Amount: $${totalAmount}`;

    // Reduce stock in inventory
    selectedItem.quantity -= quantity;

    // Add item to invoice list
    invoiceItems.push({
        name: selectedItem.name,
        quantity: quantity,
        price: selectedItem.price,
        total: selectedItem.price * quantity,
    });

    // Clear quantity input
    document.getElementById('quantity').value = '';
}

// Generate invoice (download as text file)
function generateInvoice() {
    let invoiceText = 'Invoice:\n\n';
    invoiceItems.forEach(item => {
        invoiceText += `${item.name} - Quantity: ${item.quantity}, Price: $${item.price}, Total: $${item.total}\n`;
    });
    invoiceText += `\nTotal Amount: $${totalAmount}`;

    // Create and download invoice file
    const blob = new Blob([invoiceText], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'invoice.txt';
    link.click();
}
