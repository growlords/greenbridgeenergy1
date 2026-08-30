// Interactive Solar Savings & ROI Calculator with CMS Currency Configuration

export function formatCurrencyAmount(amount, currencyConfig) {
  const symbol = currencyConfig?.symbol || '₹';
  const position = currencyConfig?.position || 'before';
  const decimals = currencyConfig?.decimalPlaces !== undefined ? currencyConfig.decimalPlaces : 0;
  
  let formattedNumber = '';
  if (currencyConfig?.code === 'INR') {
    formattedNumber = Math.round(amount).toLocaleString('en-IN', { maximumFractionDigits: decimals });
  } else {
    formattedNumber = Math.round(amount).toLocaleString('en-US', { maximumFractionDigits: decimals });
  }

  return position === 'after' ? `${formattedNumber} ${symbol}` : `${symbol}${formattedNumber}`;
}

export function initCalculator() {
  const billSlider = document.getElementById('calc-bill-slider');
  const billDisplay = document.getElementById('calc-bill-display');
  const propertyTypeSelect = document.getElementById('calc-property-type');
  const sunExposureRadios = document.querySelectorAll('input[name="sun-exposure"]');
  
  const resSavings = document.getElementById('calc-savings-25yr');
  const resSystemSize = document.getElementById('calc-system-size');
  const resPayback = document.getElementById('calc-payback');
  const resCo2 = document.getElementById('calc-co2');
  const resTrees = document.getElementById('calc-trees');
  const applyBtn = document.getElementById('calc-apply-quote-btn');

  if (!billSlider) return;

  function getCurrencyConfig() {
    return window.GPE_CURRENCY || {
      symbol: '₹',
      code: 'INR',
      position: 'before',
      decimalPlaces: 0,
      minBill: 500,
      maxBill: 1000000,
      step: 500,
      defaultBill: 4500
    };
  }

  function applySliderRange() {
    const cur = getCurrencyConfig();
    const minVal = cur.minBill !== undefined ? cur.minBill : 500;
    const maxVal = cur.maxBill !== undefined ? cur.maxBill : 1000000;
    const stepVal = cur.step !== undefined ? cur.step : (cur.code === 'INR' ? 500 : 25);
    const defVal = cur.defaultBill !== undefined ? cur.defaultBill : (cur.code === 'INR' ? 4500 : 350);

    billSlider.min = minVal;
    billSlider.max = maxVal;
    billSlider.step = stepVal;

    // Only set if current value is out of bounds or on fresh init
    const currentVal = parseFloat(billSlider.value);
    if (isNaN(currentVal) || currentVal < minVal || currentVal > maxVal) {
      billSlider.value = defVal;
    }
  }

  function calculate() {
    const currency = getCurrencyConfig();
    const monthlyBill = parseFloat(billSlider.value) || (currency.defaultBill || 4500);
    
    if (billDisplay) {
      billDisplay.textContent = `${formatCurrencyAmount(monthlyBill, currency)} / mo`;
    }

    const isCommercial = propertyTypeSelect ? propertyTypeSelect.value === 'commercial' : false;
    
    // Sun exposure factor
    let sunFactor = 1.0;
    const selectedExposure = document.querySelector('input[name="sun-exposure"]:checked');
    if (selectedExposure) {
      if (selectedExposure.value === 'optimal') sunFactor = 1.15;
      else if (selectedExposure.value === 'moderate') sunFactor = 1.0;
      else if (selectedExposure.value === 'shaded') sunFactor = 0.85;
    }

    // Annual cumulative power calculations (3.5%/year escalation)
    const annualBill = monthlyBill * 12;
    let cumulativeUtility25yr = 0;
    for (let yr = 0; yr < 25; yr++) {
      cumulativeUtility25yr += annualBill * Math.pow(1.035, yr);
    }

    // Sizing formula
    const isRupee = currency.code === 'INR';
    const ratePerKwh = isRupee ? 8.5 : 0.18;
    const annualKWh = annualBill / ratePerKwh;
    const kwNeeded = Math.max(3.5, (annualKWh / (1450 * sunFactor))).toFixed(1);

    // Turnkey cost
    const costPerWatt = isRupee ? 65 : (isCommercial ? 2.20 : 2.65);
    const grossCost = parseFloat(kwNeeded) * 1000 * costPerWatt;
    const netCost = grossCost * 0.70; // 30% Subsidy / Federal ITC

    // 25-Year net savings
    const estimatedSavings25yr = Math.max(1000, Math.round(cumulativeUtility25yr * 0.92 - netCost));

    // Payback period
    const annualSolarValue = annualBill * 0.95;
    const paybackYears = (netCost / Math.max(1, annualSolarValue)).toFixed(1);

    // Environmental metrics
    const annualGenKWh = parseFloat(kwNeeded) * 1450 * sunFactor;
    const co2TonsPerYear = ((annualGenKWh * 0.85) / 2000).toFixed(1);
    const treesPerYear = Math.round(annualGenKWh * 0.016);

    // Update DOM with formatted values
    if (resSavings) resSavings.textContent = formatCurrencyAmount(estimatedSavings25yr, currency);
    if (resSystemSize) resSystemSize.textContent = `${parseFloat(kwNeeded).toLocaleString()} kW`;
    if (resPayback) resPayback.textContent = `${paybackYears} Years`;
    if (resCo2) resCo2.textContent = `${parseFloat(co2TonsPerYear).toLocaleString()} Tons/yr`;
    if (resTrees) resTrees.textContent = `${treesPerYear.toLocaleString()} Trees/yr`;
  }

  // Set initial slider range & event listeners
  applySliderRange();

  billSlider.addEventListener('input', calculate);
  if (propertyTypeSelect) propertyTypeSelect.addEventListener('change', calculate);
  sunExposureRadios.forEach((r) => r.addEventListener('change', calculate));

  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      const monthlyBill = billSlider.value;
      const kw = resSystemSize ? resSystemSize.textContent : '8.5 kW';
      const propType = propertyTypeSelect ? propertyTypeSelect.value : 'residential';
      const currency = getCurrencyConfig();

      sessionStorage.setItem('gpe_calc_bill', monthlyBill);
      sessionStorage.setItem('gpe_calc_kw', kw);
      sessionStorage.setItem('gpe_calc_type', propType);

      window.location.hash = '#contact';
      
      setTimeout(() => {
        const formType = document.getElementById('contact-project-type');
        const formReq = document.getElementById('contact-requirement');
        if (formType) formType.value = propType;
        if (formReq) formReq.value = `Estimated System: ${kw}, Current Bill: ${formatCurrencyAmount(parseFloat(monthlyBill), currency)}/mo`;
        
        const formElem = document.getElementById('contact-form');
        if (formElem) {
          formElem.scrollIntoView({ behavior: 'smooth' });
          formElem.classList.add('highlight-form-pulse');
          setTimeout(() => formElem.classList.remove('highlight-form-pulse'), 1500);
        }
      }, 300);
    });
  }

  // Export recalculate function globally for dynamic currency changes
  window.GPE_RECALCULATE_CALC = () => {
    applySliderRange();
    calculate();
  };

  // Initial calculation
  calculate();
}
