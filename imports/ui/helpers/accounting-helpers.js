import { Template } from 'meteor/templating';
import { accounting } from 'meteor/iain:accounting';

import { getCurrencyDetails } from '../../modules/currencies/currencies.js';

Template.registerHelper('accountingFormatNumber', function acForNum(...args) {
  let result;

  // enables the arguments to be provided as args or vars
  const kw = args.pop();

  const number = args[0] || kw.hash.n;
  const precision = args[1] || kw.hash.p || '0';
  const thousand = args[2] || kw.hash.t || ',';
  const decimal = args[3] || kw.hash.d || '.';

  if (number) {
    result = accounting.formatNumber(number, precision, thousand, decimal);
  }

  return result;
});

Template.registerHelper('accountingFormatMoney', function acFormatMoney(...args) {
  let result;

  // enables the arguments to be provided as args or vars
  const kw = args.pop();

  const number = args[0] || kw.hash.number;
  const currencyCode = args[1] || kw.hash.currency;

  const currencyDetails = getCurrencyDetails(currencyCode);

  if (number && currencyDetails) {
    const symbol = currencyDetails.symbol;
    const precision = currencyDetails.decimal_digits || 2;
    const thousand = currencyDetails.thousandSeparator || ',';
    const decimal = currencyDetails.decimalSeparator || '.';
    const format = currencyDetails.format || '%s%v';

    result = accounting.formatMoney(number, symbol, precision, thousand, decimal, format);
  }

  return result;
});
