function createSalesTrendChart(sheet, normalizedData) {
    const { sales = [] } = normalizedData || {};
    
    const monthlyData = {};
    sales.forEach(row => {
        const month = row['Месяц'] || 'Unknown';
        const amount = parseFloat(row['Сумма']) || 0;
        monthlyData[month] = (monthlyData[month] || 0) + amount;
    });
    
    const chartBuilder = sheet.newChart()
        .setChartType(Charts.ChartType.LINE)
        .setTitle('Sales Trend per Month');
    
    let row = 1;
    sheet.getRange(row, 1).setValue('Month');
    sheet.getRange(row, 2).setValue('Amount');
    
    Object.entries(monthlyData).forEach((entry, idx) => {
        sheet.getRange(idx + 2, 1).setValue(entry[0]);
        sheet.getRange(idx + 2, 2).setValue(entry[1]);
    });
    
    chartBuilder.addRange(sheet.getRange(1, 1, Object.keys(monthlyData).length + 1, 2));
    sheet.insertChart(chartBuilder.build());
}
