// Rental Duration Helper Functions
// Ensures consistent duration logic across the entire application

export const DEFAULT_MIN_RENTAL_PERIOD = 1;
export const DEFAULT_MAX_RENTAL_PERIOD = 36;

/**
 * Get effective min rental period from product data
 * Falls back to DEFAULT_MIN_RENTAL_PERIOD (1) if not set
 * @param {Object} product - Product object
 * @returns {Number} Min rental period in months
 */
export const getMinRentalPeriod = (product) => {
  if (!product) return DEFAULT_MIN_RENTAL_PERIOD;
  // If product has explicit minRentalPeriod, use it (but ensure at least 1)
  if (product.minRentalPeriod && product.minRentalPeriod >= 1) {
    return product.minRentalPeriod;
  }
  return DEFAULT_MIN_RENTAL_PERIOD;
};

/**
 * Get effective max rental period from product data
 * Falls back to DEFAULT_MAX_RENTAL_PERIOD (36) if not set
 * @param {Object} product - Product object
 * @returns {Number} Max rental period in months
 */
export const getMaxRentalPeriod = (product) => {
  if (!product) return DEFAULT_MAX_RENTAL_PERIOD;
  if (product.maxRentalPeriod && product.maxRentalPeriod >= 1) {
    return product.maxRentalPeriod;
  }
  return DEFAULT_MAX_RENTAL_PERIOD;
};

/**
 * Generate rental duration options for dropdowns
 * Format: [{ value: 1, label: "1 month - ₹699", total: 699 }]
 * 
 * @param {Number} monthlyRent - Monthly rental price
 * @param {Object} product - Product object (optional, for min/max from product)
 * @param {Number} minMonths - Override min months (default: 1)
 * @param {Number} maxMonths - Override max months (default: 36)
 * @returns {Array} Array of duration option objects
 */
export const generateRentalDurationOptions = (monthlyRent, product = null, minMonths = null, maxMonths = null) => {
  const min = minMonths !== null ? minMonths : getMinRentalPeriod(product);
  const max = maxMonths !== null ? maxMonths : getMaxRentalPeriod(product);
  
  const options = [];
  for (let month = min; month <= max; month++) {
    const total = monthlyRent * month;
    options.push({
      value: month,
      label: `${month} ${month === 1 ? 'month' : 'months'} - ₹${total.toLocaleString()}`,
      total: total,
      monthlyRent: monthlyRent
    });
  }
  return options;
};

/**
 * Get duration label with proper pluralization
 * @param {Number} months - Number of months
 * @returns {String} "1 month" or "X months"
 */
export const getDurationLabel = (months) => {
  if (!months || months < 1) return '1 month';
  return `${months} ${months === 1 ? 'month' : 'months'}`;
};

/**
 * Calculate total rental price
 * @param {Number} monthlyRent - Monthly rental price
 * @param {Number} months - Number of months
 * @returns {Number} Total price
 */
export const calculateRentalTotal = (monthlyRent, months) => {
  const rent = monthlyRent || 0;
  const duration = months || 1;
  return rent * duration;
};

/**
 * Format rental price for display
 * @param {Number} price - Price amount
 * @returns {String} Formatted price string
 */
export const formatRentalPrice = (price) => {
  if (!price && price !== 0) return '₹0';
  return `₹${price.toLocaleString()}`;
};

/**
 * Get default selected duration (always 1 month)
 * @returns {Number} 1
 */
export const getDefaultDuration = () => 1;
