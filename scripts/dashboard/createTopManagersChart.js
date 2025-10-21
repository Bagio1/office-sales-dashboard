function createTopManagersChart(sheet, normalizedData) {
    const { sales = [] } = normalizedData || {};
    
    const managerSales = {};
    sales.forEach(row => {
        const manager = row['Менеджер'] || 'Unknown';
        const amount = parseFloat(row['Сумма']) || 0;
        managerSales[manager] = (managerSales[manager] || 0) + amount;
    });
    
    const topManagers = Object.entries(managerSales)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);
    
    // Write data to sheet for chart
    let row = 1;
    sheet.getRange(row, 1).setValue('Manager');
    sheet.getRange(row, 2).setValue('Sales Amount');
    
    topManagers.forEach((entry, idx) => {
        sheet.getRange(idx + 2, 1).setValue(entry[0]);
        sheet.getRange(idx + 2, 2).setValue(entry[1]);
    });
    
    // Create bar chart using Google Apps Script API
    const chartBuilder = sheet.newChart()
        .setChartType(Charts.ChartType.BAR)
        .setTitle('Top-3 Managers by Sales')
        .addRange(sheet.getRange(1, 1, topManagers.length + 1, 2));
    
    sheet.insertChart(chartBuilder.build());
}
