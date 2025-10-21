// main.js

// Import ETL helpers
const { loadCSV } = require('./etlscripts/loadData');
const { cleanSalesData } = require('./etlscripts/cleanSalesData');
const { cleanManagersData } = require('./etlscripts/cleanManagersData');
const { cleanPriceData } = require('./etlscripts/cleanPriceData');
const path = require('path');

// Load data (works in macro or Node thanks to loadCSV fallback)
const salesData = loadCSV(path.join(__dirname, '..', 'data', 'База_Аналитика_продаж.csv'));
const managersData = loadCSV(path.join(__dirname, '..', 'data', 'Менеджеры.csv'));
const priceData = loadCSV(path.join(__dirname, '..', 'data', 'Цена_справочник.csv'));

// Clean data
const cleanedSalesData = salesData ? cleanSalesData(salesData) : [];
const cleanedManagersData = managersData ? cleanManagersData(managersData) : [];
const cleanedPriceData = priceData ? cleanPriceData(priceData) : [];

// Placeholder normalizeData: implement as needed in your project
function normalizeData(sales, managers, prices) {
	return { sales, managers, prices };
}

const normalizedData = normalizeData(cleanedSalesData, cleanedManagersData, cleanedPriceData);

// If running in macro environment, build the dashboard; otherwise print a summary
if (typeof Api !== 'undefined' && Api && Api.Worksheet && typeof Api.Worksheet.getActive === 'function') {
	const sheet = Api.Worksheet.getActive();
	// The following creators assume macro APIs. Guard/adjust as needed in your environment.
	try { if (typeof createKPI === 'function') createKPI(sheet, normalizedData); } catch {}
	try { if (typeof createSalesTrendChart === 'function') createSalesTrendChart(sheet, normalizedData); } catch {}
	try { if (typeof createProductSalesChart === 'function') createProductSalesChart(sheet, normalizedData); } catch {}
	try { if (typeof createTopManagersChart === 'function') createTopManagersChart(sheet, normalizedData); } catch {}
	try { if (typeof createManagerFilter === 'function') createManagerFilter(sheet, normalizedData); } catch {}
	try { if (typeof createMonthFilter === 'function') createMonthFilter(sheet, normalizedData); } catch {}
} else {
	// Headless Node run: output simple stats to console
	console.log('Sales rows:', cleanedSalesData.length);
	console.log('Managers rows:', cleanedManagersData.length);
	console.log('Prices rows:', cleanedPriceData.length);
}
