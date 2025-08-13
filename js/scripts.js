// Declare the chart and chartInitialized variables
let chart;
let chartInitialized = false;

// input with id "username" on change event
document.getElementById('username').addEventListener('input', function () {
    const username = this.value;

    // regx to check if username has at least 1 capital letter, 1 small letter, 1 special character, 1 number and is at least 8 characters long
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
 
    if (regex.test(username)) {
        // set the username input border color to green
        this.style.borderColor = 'green';
    } else {
        this.style.borderColor = 'red';
    }


});

document.addEventListener("DOMContentLoaded", function () {
    // Add event listener for the "Chart" tab
    document.getElementById('chart-tab').addEventListener('shown.bs.tab', function () {
        // Fetch data from the "Data" tab
        const months = [
            'january', 'february', 'march', 'april', 'may', 'june',
            'july', 'august', 'september', 'october', 'november', 'december'
        ];
        const incomeData = [];
        const expenseData = [];

        months.forEach(month => {
            const income = parseFloat(document.getElementById(`income-${month}`)?.value) || 0;
            const expense = parseFloat(document.getElementById(`expense-${month}`)?.value) || 0;
            incomeData.push(income);
            expenseData.push(expense);
        });

        if (!chartInitialized) {
            // Initialize the chart
            const ctx = document.getElementById('barChart').getContext('2d');
            chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: months.map(month => month.charAt(0).toUpperCase() + month.slice(1)),
                    datasets: [
                        {
                            label: 'Income',
                            data: incomeData,
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Expense',
                            data: expenseData,
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Monthly Income vs Expense'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            chartInitialized = true;
        } else {
            // Update the chart data and force a re-render
            chart.data.datasets[0].data = incomeData;
            chart.data.datasets[1].data = expenseData;
            chart.update();
        }
    });

    // Add event listener for the "Download" button
    document.getElementById('download-btn').addEventListener('click', function () {
        const canvas = document.getElementById('barChart');
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = 'chart.png';
        link.click();
    });
});