// createSalesTrendChart.js

function createSalesTrendChart(sheet) {
    const chart = Api.Chart.create({
        range: sheet.getRange("A1:B12"), // Range where sales data is located
        type: 'line', // Line chart for trend
        title: 'Sales Trend per Month'
    });
    sheet.insertChart(chart);
}
