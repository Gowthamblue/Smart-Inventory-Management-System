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
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'fetch.php', true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            const inventoryData = JSON.parse(xhr.responseText);
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
        }
    };
    xhr.send();
}

function fetchBillingHistory() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'fetch_billing_history.php', true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            const historyData = JSON.parse(xhr.responseText);
            const historyBody = document.getElementById('billing-history-body');
            historyBody.innerHTML = '';
            historyData.forEach(item => {
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
        }
    };
    xhr.send();
}

document.getElementById('billing-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const productId = document.getElementById('product-id').value;
    const quantity = document.getElementById('quantity').value;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'process_billing.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {
        document.getElementById('billing-result').innerHTML = this.responseText;
        fetchInventoryData();
        fetchBillingHistory();
    };
    xhr.send(`product_id=${encodeURIComponent(productId)}&quantity=${encodeURIComponent(quantity)}`);

});

window.onload = function() {
    fetchInventoryData();
    fetchBillingHistory();
}; 
// Function to fetch data for the dashboard
function updateDashboard() {
    // Fetch data from the backend PHP file
    fetch('fetch_dashboard_data.php') // Adjust the path as per your project structure
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Parse the JSON response
        })
        .then(data => {
            // Update the dashboard elements with fetched data
            document.getElementById('total-items').innerText = data.totalItems || 0;
            document.getElementById('low-stock-alerts').innerText = data.lowStockAlerts || 0;
            document.getElementById('items-sold-today').innerText = data.itemsSoldToday || 0;
        })
        .catch(error => {
            console.error('Error fetching dashboard data:', error);
            // Display error messages in case of failure
            document.getElementById('total-items').innerText = 'Error';
            document.getElementById('low-stock-alerts').innerText = 'Error';
            document.getElementById('items-sold-today').innerText = 'Error';
        });
}

// Update the dashboard every 10 seconds
setInterval(updateDashboard, 10000);

// Initial update when the page loads
updateDashboard();


document.addEventListener("DOMContentLoaded", function() {
    // Function to fetch low stock alerts from the server
    function fetchLowStockAlerts() {
        // Send AJAX request to PHP file to fetch low stock alerts
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'get_alerts.php', true); // 'get_alerts.php' is the PHP file that will fetch alerts from the database
        xhr.onload = function() {
            if (xhr.status === 200) {
                const alertsTableBody = document.querySelector('#alertsTable tbody');
                alertsTableBody.innerHTML = xhr.responseText; // Insert the table rows directly into the table
            } else {
                console.error('Error fetching alerts data');
            }
        };
        xhr.send();
    }

    // Fetch low stock alerts when the page loads
    fetchLowStockAlerts();
});
