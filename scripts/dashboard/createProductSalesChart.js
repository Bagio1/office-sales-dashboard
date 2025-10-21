

function createProductSalesChart(sheet, normalizedData) {
    const { sales = [] } = normalizedData || {};
    
    const productSales = {};
    sales.forEach(row => {
        const product = row['Товар'] || 'Unknown';
        const qty = parseInt(row['Количество']) || 0;
        productSales[product] = (productSales[product] || 0) + qty;
    });
    
    // Write data to sheet for chart
    let row = 1;
    sheet.getRange(row, 1).setValue('Product');
    sheet.getRange(row, 2).setValue('Quantity');
    
    Object.entries(productSales).forEach((entry, idx) => {
        sheet.getRange(idx + 2, 1).setValue(entry[0]);
        sheet.getRange(idx + 2, 2).setValue(entry[1]);
    });
    
    // Create bar chart using Google Apps Script API
    const chartBuilder = sheet.newChart()
        .setChartType(Charts.ChartType.BAR)
        .setTitle('Product Sales by Quantity')
        .addRange(sheet.getRange(1, 1, Object.keys(productSales).length + 1, 2));
    
    sheet.insertChart(chartBuilder.build());
}
