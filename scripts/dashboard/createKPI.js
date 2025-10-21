function createKPI(sheet, normalizedData) {
    const { sales = [], managers = [] } = normalizedData || {};
    
    const totalSales = sales.reduce((sum, row) => sum + (parseFloat(row['Сумма']) || 0), 0);
    const totalUnits = sales.reduce((sum, row) => sum + (parseInt(row['Количество']) || 0), 0);
    const averageCheck = sales.length > 0 ? totalSales / sales.length : 0;
    const activeManagers = new Set(sales.map(row => row['Менеджер']).filter(Boolean)).size;
    
    sheet.getRange("A1").setValue("Total Sales: " + totalSales.toFixed(2));
    sheet.getRange("A2").setValue("Total Units Sold: " + totalUnits);
    sheet.getRange("A3").setValue("Average Check: " + averageCheck.toFixed(2));
    sheet.getRange("A4").setValue("Active Managers: " + activeManagers);
}
