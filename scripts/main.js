// Import ETL functions
const { loadCSV } = require('./etlscripts/loadData');
const { cleanSalesData } = require('./etlscripts/cleanSalesData');
const { cleanManagersData } = require('./etlscripts/cleanManagersData');
const { cleanPriceData } = require('./etlscripts/cleanPriceData');
const { normalizeData } = require('./etlscripts/normalizeData');
const path = require('path');

// Add tolerant key normalizer (keeps Cyrillic incl. ё)
function normalizeKey(key) {
    return key ? String(key).trim().toLowerCase().replace(/\uFEFF/g, '').replace(/[^a-zа-яё0-9]/gi, '') : null;
}

// Flexible header harmonization for Sales rows
function harmonizeSalesHeaders(rows = []) {
    const candidates = {
        ID: ['id', 'код', 'номер', '№', 'orderid', 'id заказа'],
        Date: ['дата', 'date', 'дата продажи', 'sale_date'],
        Manager: ['менеджер', 'фио', 'manager', 'продавец', 'seller', 'manager_name'],
        City: ['город', 'city', 'населенный пункт', 'region'],
        Product: ['товар', 'наименование', 'product', 'product_name', 'товар/услуга', 'продукт'],
        Quantity: ['количество', 'qty', 'кол-во', 'quantity', 'количество, г/мл'],
        Price: ['цена', 'стоимость', 'price', 'unit_price'],
        Type: ['тип', 'type', 'тип покупки'],
        PaymentMethod: ['способ оплаты', 'payment', 'payment_method', 'оплата']
    };

    const pick = (row, names) => {
        const byNorm = new Map();
        for (const k of Object.keys(row)) byNorm.set(normalizeKey(k), k);
        for (const n of names) {
            const k = byNorm.get(normalizeKey(n));
            if (k) return row[k];
        }
        return null;
    };

    return rows.map(r => ({
        ID: pick(r, candidates.ID),
        Date: pick(r, candidates.Date),
        Manager: pick(r, candidates.Manager),
        City: pick(r, candidates.City),
        Product: pick(r, candidates.Product),
        Quantity: pick(r, candidates.Quantity),
        Price: pick(r, candidates.Price),
        Type: pick(r, candidates.Type),
        PaymentMethod: pick(r, candidates.PaymentMethod)
    }));
}

function main() {
    console.log('🚀 Starting data processing...');

    // Load settings for defaults/fallbacks
    let settings = {};
    try {
        settings = require(path.join(__dirname, '../config/settings.json'));
    } catch (_) {
        settings = {};
    }
    const options = {
        defaultManager: settings?.defaults?.manager || null,
        defaultCity: settings?.defaults?.city || null,
        fallbackPrices: settings?.fallbackPrices || {}
    };

    // Load raw CSV data (auto-detected delimiters, lowercased headers)
    const salesData = loadCSV('./data/База_Аналитика_продаж.csv');
    const managersData = loadCSV('./data/Менеджеры.csv');
    const priceData = loadCSV('./data/Цена_справочник.csv');

    // Flexible remap of Sales headers (handles unknown variants)
    const salesDataHarmonized = harmonizeSalesHeaders(salesData || []);

    // Diagnostics: Print raw data
    console.log('\n🔍 Raw Data Diagnostics:');
    console.log('- First 10 lines of Sales CSV (parsed objects):');
    console.log(salesData.slice(0, 10));
    console.log('- Parsed Sales Headers (as loaded):');
    console.log(Object.keys(salesData[0] || {}));
    console.log('- Harmonized Sales Row Example:');
    console.log(salesDataHarmonized[0]);

    // Prepare dictionaries
    const cleanedManagersData = cleanManagersData(managersData || []);
    const cleanedPriceData = cleanPriceData(priceData || []);

    // Diagnostics on lookups
    console.log('- First 20 Price Dictionary Keys:');
    console.log(Object.keys(cleanedPriceData).slice(0, 20));
    console.log('- First 20 Manager Dictionary Keys:');
    console.log(cleanedManagersData.slice(0, 20).map(m => m.Manager));

    // Clean and normalize data
    const cleanedSalesData = cleanSalesData(salesDataHarmonized || []);
    const normalizedData = normalizeData(cleanedSalesData, cleanedManagersData, cleanedPriceData, options);

    // Extra diagnostics: unmatched products/managers for first N
    const priceKeys = new Set(Object.keys(cleanedPriceData).map(normalizeKey));
    const managerKeys = new Set(cleanedManagersData.map(m => normalizeKey(m.Manager)));
    const unmatchedProducts = new Set();
    const unmatchedManagers = new Set();
    for (const r of cleanedSalesData) {
        if (r.Product && !priceKeys.has(normalizeKey(r.Product))) unmatchedProducts.add(normalizeKey(r.Product));
        if (r.Manager && !managerKeys.has(normalizeKey(r.Manager))) unmatchedManagers.add(normalizeKey(r.Manager));
        if (unmatchedProducts.size > 50 && unmatchedManagers.size > 50) break;
    }
    console.log('\n🔎 Unmatched Products (normalized, sample):', Array.from(unmatchedProducts).slice(0, 20));
    console.log('🔎 Unmatched Managers (normalized, sample):', Array.from(unmatchedManagers).slice(0, 20));

    // Diagnostics: Check for nulls and flags
    console.log('\n🔍 Normalized Data Diagnostics:');
    console.log('- Rows with Null Fields (sample):');
    console.log(normalizedData.filter(row => !row.ID || !row.Date || !row.Product || !row.Quantity || !row.Price).slice(0, 10));
    console.log('- Rows with Flags (sample):');
    console.log(normalizedData.filter(row => row.Flags.MissingPrice || row.Flags.MissingManager || row.Flags.MissingProduct).slice(0, 10));

    // Log summary
    console.log('\n📊 Normalized Data Summary (wrapped as { "sales": [...] }):');
    const output = { sales: normalizedData };
    console.log(JSON.stringify(output, null, 2));

    console.log('\n✅ Data processing completed!');
}

main();
