
const Api = require('some-library'); 
const { getManagersList, filterDashboardByManager } = require('../utils/managerUtils');

function createManagerFilter(sheet) {
    const managers = getManagersList(); 
    const dropdown = Api.UI.createDropdown({
        options: managers, 
        default: 'All',
        onChange: function(selectedManager) {
            filterDashboardByManager(selectedManager);
        }
    });
    sheet.getRange("B1").insertControl(dropdown);
}

module.exports = createManagerFilter;

