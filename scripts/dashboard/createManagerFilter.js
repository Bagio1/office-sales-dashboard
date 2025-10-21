function createManagerFilter(sheet, normalizedData) {
    const { sales = [] } = normalizedData || {};
    
    const managers = [...new Set(sales.map(row => row['Менеджер']).filter(Boolean))];
    
    const managerList = ['All', ...managers];
    sheet.getRange("B1").setDataValidation(
        SpreadsheetApp.newDataValidation()
            .requireValueInList(managerList)
            .build()
    );
    
    sheet.getRange("B1").setValue('All');
    sheet.getRange("A1").setValue('Manager Filter:');
}