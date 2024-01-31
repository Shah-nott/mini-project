document.addEventListener('DOMContentLoaded', function () {
    fetchDataAndRenderChart();
    fetchEnergyUsageAndRenderChart();
    fetchPowerConsumptionAndRenderChart();
    fetchEnergyTransferAndRenderChart();
});

function fetchDataAndRenderChart() {
    fetch('/data')
        .then(response => response.text())
        .then(csvString => {
            const data = parseCSV(csvString);
            renderLineChart(data);
        })
        .catch(error => console.error('Error fetching data:', error));
        
}

function fetchEnergyUsageAndRenderChart() {
    fetch('/energy_usage_data')
        .then(response => response.text())
        .then(csvString => {
            const data = parseCSV(csvString);
            renderPieChart(data);
        })
        .catch(error => console.error('Error fetching energy usage data:', error));
}

function fetchPowerConsumptionAndRenderChart() {
    fetch('/power_consumption_data')
        .then(response => response.text())
        .then(csvString => {
            const data = parseCSV(csvString);
            renderBarChart(data);
        })
        .catch(error => console.error('Error fetching power consumption data:', error));
}

function fetchEnergyTransferAndRenderChart() {
    fetch('/energy_transfer_data')
        .then(response => response.text())
        .then(csvString => {
            const data = parseCSV(csvString);
            renderEnergyTransferChart(data);
        })
        .catch(error => console.error('Error fetching energy transfer data:', error));
}

function parseCSV(csvString) {
    const lines = csvString.split('\n').map(line => line.trim()).filter(line => line);
    const headers = lines[0].split(',');
    return lines.slice(1).map(line => {
        const values = line.split(',');
        return headers.reduce((object, header, index) => {
            object[header.trim()] = values[index].trim();
            return object;
        }, {});
    });
}

function renderLineChart(data) {
    const ctx = document.getElementById('dataGraph').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(item => item['Date']),
            datasets: [{
                label: 'Current (A)', // This is the dataset legend
                data: data.map(item => parseFloat(item['Value'])),
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Current readings (A) over time (in days)',
                    font: {
                        size: 18
                    },
                    padding: {
                        top: 10,
                        bottom: 30
                    }
                }
            },
            legend: {
                display: true,
                position: 'top'
            }
        }
    });
}

function renderPieChart(data) {
    const ctx = document.getElementById('energyUsageGraph').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: data.map(item => item.Item), // Make sure 'Item' matches your CSV header
            datasets: [{
                data: data.map(item => parseFloat(item.Energy_Usage)), // Make sure 'Energy_Usage' matches your CSV header
                backgroundColor: [
                    // Colors for each category
                    'red', 'blue', 'green', 'yellow', 'purple', 'orange'
                ],
                borderColor: 'white',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            legend: {
                position: 'right'
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Energy Usage by %',
                    font: {
                        size: 18
                    },
                }
            }
        }
    });
}

function renderBarChart(data) {
    const ctx = document.getElementById('powerConsumptionGraph').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(item => item.Appliance), // Assuming 'Appliance' is a column in your CSV
            datasets: [{
                label: 'Power Consumption (Watt)', // Label for the dataset
                data: data.map(item => parseFloat(item.Power_Consumption)), // Assuming 'Power_Consumption' is a column in your CSV
                backgroundColor: [
                    // Colors for each bar
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    // ... more colors for each appliance
                ],
                borderColor: [
                    // Border colors for each bar
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    // ... more colors for each appliance
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function renderEnergyTransferChart(data) {
    const ctx = document.getElementById('energyTransferGraph').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(item => item.Time), // Assuming 'Time' is a column in your CSV
            datasets: [{
                label: 'Energy Transfer (Watts)', // Label for the dataset
                data: data.map(item => parseFloat(item['Energy Transfer'])), // Assuming 'Energy Transfer' is a column in your CSV
                fill: false,
                borderColor: 'rgb(255, 205, 86)',
                tension: 0.1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Energy Transfer Rates Over Time',
                    font: {
                        size: 18
                    }
                }
            },
            legend: {
                display: true,
                position: 'top'
            }
        }
    });
}