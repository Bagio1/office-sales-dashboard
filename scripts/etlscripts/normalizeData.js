function normalizeKey(key) {
    return key ? String(key).trim().toLowerCase().replace(/\uFEFF/g, '').replace(/[^a-zа-яё0-9]/gi, '') : null;
}

function parseRUDate(value) {
    if (!value) return null;
    const t = String(value).replace(/\uFEFF/g, '').trim();
    const m = t.match(/(\d{1,2})[.\-/](\d{1,2})[.\-/](\d{2,4})/);
    if (!m) return null;
    let [, d, mo, y] = m;
    if (y.length === 2) y = Number(y) > 70 ? '19' + y : '20' + y;
    const iso = `${y.padStart(4, '0')}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}`;
    const dt = new Date(iso);
    return Number.isNaN(dt.getTime()) ? null : dt;
}

function getMonthName(dateObj) {
    if (!dateObj) return null;
    const names = [
        'January','February','March','April','May','June',
        'July','August','September','October','November','December'
    ];
    return names[dateObj.getMonth()];
}

function normalizeData(sales, managers, prices, options = {}) {
    const { fallbackPrices = {}, defaultManager = null, defaultCity = null } = options || {};
    const fallbackMap = {};
    for (const k of Object.keys(fallbackPrices)) {
        const v = fallbackPrices[k];
        const num = v == null ? null : Number(String(v).replace(',', '.'));
        if (!Number.isNaN(num)) fallbackMap[normalizeKey(k)] = num;
    }

    return sales.map(row => {
        const normalizedManagerName = normalizeKey(row.Manager);
        const manager = managers.find(m => normalizeKey(m.Manager) === normalizedManagerName) || {};

        const normalizedProductName = normalizeKey(row.Product);
        const priceFromDict = prices[normalizedProductName] ?? null;
        const priceFromFallback = fallbackMap[normalizedProductName] ?? null;
        const price = priceFromDict ?? priceFromFallback ?? null;

        // robust quantity parse: trim, remove spaces, handle comma decimal
        const qtyStr = row.Quantity != null ? String(row.Quantity).replace(/\u00A0/g, ' ').replace(/\s+/g, '').replace(',', '.') : null;
        const qty = qtyStr != null && qtyStr !== '' ? Number(qtyStr) : null;

        const sum = qty != null && !Number.isNaN(qty) && price != null ? qty * price : null;

        const dateObj = parseRUDate(row.Date);

        const resolvedManager = row.Manager || manager.Manager || defaultManager || null;
        const resolvedCity = row.City || defaultCity || null;

        return {
            ID: row.ID || null,
            Date: row.Date || null,
            Manager: resolvedManager,
            City: resolvedCity,
            Product: row.Product || null,
            Quantity: qty,
            Price: price,
            Sum: sum,
            Month: dateObj ? String(dateObj.getMonth() + 1).padStart(2, '0') : null,
            MonthName: getMonthName(dateObj),
            DayOfWeek: dateObj ? dateObj.getDay() : null,
            IsWeekend: dateObj ? [0, 6].includes(dateObj.getDay()) : null,
            Type: row.Type || null,
            PaymentMethod: row.PaymentMethod || null,
            Flags: {
                MissingPrice: price === null,
                MissingManager: !resolvedManager,
                MissingProduct: !row.Product,
                InvalidDate: !dateObj && !!row.Date,
                InvalidQuantity: qty == null || Number.isNaN(qty)
            }
        };
    });
}

module.exports = { normalizeData };