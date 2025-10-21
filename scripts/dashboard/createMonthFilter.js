// createMonthFilter.js

// Import the correct library for UI and spreadsheet manipulation
const Api = require('correct-library-name'); // Replace 'correct-library-name' with the actual library name
const { filterDashboardByMonth } = require('../utils/monthUtils'); // Ensure this file and function exist

function createMonthFilter(sheet) {
    // Define months dynamically or use a localization library if needed
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Create a dropdown using the library's UI API
    const dropdown = Api.UI.createDropdown({
        options: months, // Array of months
        default: 'All',
        onChange: function(selectedMonth) {
            // Ensure the filterDashboardByMonth function is implemented correctly
            filterDashboardByMonth(selectedMonth);
        }
    });

    // Verify the method to insert the dropdown into the sheet
    if (sheet && typeof sheet.getRange === 'function') {
        const range = sheet.getRange("B2");
        if (range && typeof range.insertControl === 'function') {
            range.insertControl(dropdown);
        } else {
            console.error("The 'insertControl' method is not available on the range object.");
        }
    } else {
        console.error("The 'sheet' object or its 'getRange' method is not defined.");
    }
}

module.exports = createMonthFilter;
