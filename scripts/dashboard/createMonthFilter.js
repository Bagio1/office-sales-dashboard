function createMonthFilter(sheet, normalizedData) {
    const { sales = [] } = normalizedData || {};
    
    const monthSet = new Set(sales.map(row => row['Месяц']).filter(Boolean));
    const months = ['All', ...Array.from(monthSet).sort()];
    
    sheet.getRange("B2").setDataValidation(
        SpreadsheetApp.newDataValidation()
            .requireValueInList(months)
            .build()
    );
    
    sheet.getRange("B2").setValue('All');
    sheet.getRange("A2").setValue('Month Filter:');
}