// alertsAndNotificationsComponent.js
function loadCSV() {
  const fileInput = document.getElementById('failure_pulley_data_ensemble_sorted_final.csv');
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const csvContent = e.target.result;
      const excelData = parseCSV(csvContent);

      // Call the alertsAndNotificationsComponent function with the loaded data
      alertsAndNotificationsComponent(excelData);
    };

    reader.readAsText(file);
  } else {
    alert('Please select a CSV file.');
  }
}

function parseCSV(csvContent) {
  const rows = csvContent.split('\n');
  const headers = rows[0].split(',');

  const excelData = [];

  for (let i = 1; i < rows.length; i++) {
    const rowData = rows[i].split(',');
    const dataEntry = {};

    for (let j = 0; j < headers.length; j++) {
      dataEntry[headers[j]] = rowData[j];
    }

    excelData.push(dataEntry);
  }

  return excelData;
}

function alertsAndNotificationsComponent(excelData) {
  // Sort the data by Failure Percentage in descending order
  const sortedData = excelData.sort((a, b) => b.Failure_Percentage - a.Failure_Percentage);

  // Get the top 5 faulty pulleys
  const top5FaultyPulleys = sortedData.slice(0, 5);

  // Access the table body element
  const tableBody = document.getElementById('pulleyTableBody');

  // Clear existing rows in the table
  tableBody.innerHTML = '';

  // Populate the table dynamically
  top5FaultyPulleys.forEach(pulley => {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td>${pulley.Id}</td>
      <td>${pulley.Temperature ? pulley.Temperature.toFixed(5) : ''}</td>
      <td>${pulley.Vibration_Level ? pulley.Vibration_Level.toFixed(5) : ''}</td>
      <td>${pulley.Failure_Percentage.toFixed(2)}%</td>
    `;
    tableBody.appendChild(newRow);
  });
}
