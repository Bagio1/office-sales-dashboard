
function createKPI(sheet) {
    const totalSales = getTotalSales(); 
    const totalUnits = getTotalUnits(); 
    const averageCheck = getAverageCheck(); 
    const activeManagers = getActiveManagersCount(); 
    
    sheet.getRange("A1").setValue("Total Sales: " + totalSales);
    sheet.getRange("A2").setValue("Total Units Sold: " + totalUnits);
    sheet.getRange("A3").setValue("Average Check: " + averageCheck);
    sheet.getRange("A4").setValue("Active Managers: " + activeManagers);
}