function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
    document.querySelectorAll('.sidebar a').forEach(link => link.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    document.querySelectorAll('.sidebar a').forEach(link => {
        if (link.getAttribute('onclick') === `showSection('${sectionId}')`) {
            link.classList.add('active');
        }
    });
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const menuIcon = document.getElementById('menu-icon');

    sidebar.classList.toggle('closed');
    mainContent.classList.toggle('closed');

    if (sidebar.classList.contains('closed')) {
        menuIcon.classList.remove('fa-bars');
        menuIcon.classList.add('fa-times');
    } else {
        menuIcon.classList.remove('fa-times');
        menuIcon.classList.add('fa-bars');
    }
}

function searchInventory() {
    const filter = document.getElementById('search-bar').value.toUpperCase();
    const table = document.querySelector("#inventory table");
    const rows = table.getElementsByTagName('tr');

    for (let i = 1; i < rows.length; i++) {
        const cols = rows[i].getElementsByTagName('td');
        let isMatch = false;
        for (let j = 0; j < cols.length; j++) {
            if (cols[j].innerText.toUpperCase().indexOf(filter) > -1) {
                isMatch = true;
                break;
            }
        }
        rows[i].style.display = isMatch ? "" : "none";
    }
}

function fetchInventoryData() {
    axios.get('./Backend/fetch.php')
        .then(response => {
            const inventoryData = response.data;
            const tableBody = document.querySelector('#inventory tbody');
            tableBody.innerHTML = '';

            inventoryData.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.product_id}</td>
                    <td>${item.product_name}</td>
                    <td>${item.order_id}</td>
                    <td>${item.available_stock}</td>
                    <td>${item.price}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Inventory fetch error:", error);
        });
}


function fetchBillingHistory() {
    axios.get('./Backend/fetch_billing_history.php')
        .then(response => {
            const historyBody = document.getElementById('billing-history-body');
            historyBody.innerHTML = '';

            response.data.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.billing_id}</td>
                    <td>${item.product_name}</td>
                    <td>${item.quantity}</td>
                    <td>${item.total_price}</td>
                    <td>${item.date_time}</td>
                `;
                historyBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Billing history error:", error);
        });
}


document.addEventListener("DOMContentLoaded", () => {
    const billingForm = document.getElementById('billing-form');

    if (billingForm) {
        billingForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const productId = document.getElementById('product-id').value;
            const quantity = document.getElementById('quantity').value;

            axios.post('./Backend/process_billing.php', {
                product_id: productId,
                quantity: quantity
            })
            .then(response => {
                document.getElementById('billing-result').innerHTML = response.data;
                fetchInventoryData();
                fetchBillingHistory();
            })
            .catch(error => {
                console.error("Billing error:", error);
            });
        });
    }
});



window.onload = function() {
    fetchInventoryData();
    fetchBillingHistory();
}; 

// Function to fetch data for the dashboard
function updateDashboard() {
    axios.get('./Backend/fetch_dashboard_data.php')
        .then(response => {
            const data = response.data;
            document.getElementById('total-items').innerText = data.totalItems || 0;
            document.getElementById('low-stock-alerts').innerText = data.lowStockAlerts || 0;
            document.getElementById('items-sold-today').innerText = data.itemsSoldToday || 0;
        })
        .catch(error => {
            console.error("Dashboard error:", error);
        });
}

updateDashboard();


// Update the dashboard every 10 seconds
//setInterval(updateDashboard, 10000);


function fetchLowStockAlerts() {
    axios.get('./Backend/get_alerts.php')
        .then(response => {
            document.querySelector('#alertsTable tbody').innerHTML = response.data;
        })
        .catch(error => {
            console.error("Alerts fetch error:", error);
        });
}

document.addEventListener("DOMContentLoaded", fetchLowStockAlerts);



document.addEventListener("click", function(event) {
    if (event.target.classList.contains("restock-btn")) {
        const productId = event.target.getAttribute('data-product-id');
        const productName = encodeURIComponent(event.target.getAttribute('data-product-name')); // Encode to handle spaces

        console.log("Redirecting to restock_invoice.php with:", productId, productName); // Debugging

        // Redirect with data in URL
        window.location.href = `../Backend/restock_invoice.php?product_id=${productId}&product_name=${productName}`;
    }
});

document.addEventListener("DOMContentLoaded", function() {
    // Extract only the query parameters (ignoring #alerts)
    const queryString = window.location.href.split("?")[1]; 

    if (queryString) {
        const urlParams = new URLSearchParams(queryString);
        const restockSuccess = urlParams.get('restock_success');

        console.log("Detected restock_success:", restockSuccess); // Debugging

        if (restockSuccess === "1") {
            showPopup("✅ Restock successful!");
        } else if (restockSuccess === "0") {
            showPopup("❌ Restock failed. Please try again.", "error");
        }
    }
});

// Function to show the pop-up message
function showPopup(message, type = "success") {
    const popup = document.getElementById("restock-message");
    const text = document.getElementById("restock-text");

    if (!popup || !text) {
        console.error("Popup elements not found!"); // Debugging
        return;
    }

    text.textContent = message;
    popup.className = type === "error" ? "popup error" : "popup"; // Apply different colors for success/error
    popup.style.display = "block";

    setTimeout(() => {
        popup.style.display = "none";
    }, 3000); // Hide after 3 seconds
}







function fetchInvoiceHistory() {
    axios.get('./Backend/fetch_invoice_history.php')
        .then(response => {
            const historyBody = document.getElementById('invoice-history-body');
            historyBody.innerHTML = '';

            response.data.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.invoice_id}</td>
                    <td>${item.product_name}</td>
                    <td>${item.quantity}</td>
                    <td>₹${item.total_price}</td>
                    <td>${item.date_time}</td>
                    <td>
                        <button class="invoice-btn"
                            data-id="${item.invoice_id}"
                            data-product="${item.product_name}"
                            data-quantity="${item.quantity}"
                            data-price="${item.total_price}"
                            data-date="${item.date_time}">
                            Generate Invoice
                        </button>
                    </td>
                `;
                historyBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Invoice history error:", error);
        });
}

fetchInvoiceHistory();


function generateTxtInvoice(invoiceId, productName, quantity, totalPrice, date) {
    const invoiceContent = `Invoice ID: ${invoiceId}\nProduct Name: ${productName}\nQuantity: ${quantity}\nTotal Price: ₹${totalPrice}\nDate: ${date}\n\nThank you for your purchase!`;

    const blob = new Blob([invoiceContent], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Invoice_${invoiceId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}





// setInterval(() => {
//     location.reload();
// }, 30000); // Refresh every 30 seconds
