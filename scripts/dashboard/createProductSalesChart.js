// createSalesTrendChart.js

function createSalesTrendChart(sheet) {
    const chart = Api.Chart.create({
        range: sheet.getRange("A1:B12"), 
        type: 'line', 
        title: 'Sales Trend per Month'
    });
    sheet.insertChart(chart);
}
