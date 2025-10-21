// createTopManagersChart.js

function createTopManagersChart(sheet) {
    const chart = Api.Chart.create({
        range: sheet.getRange("A1:B3"), // Top managers data
        type: 'bar', // Horizontal bar chart
        title: 'Top-3 Managers'
    });
    sheet.insertChart(chart);
}
