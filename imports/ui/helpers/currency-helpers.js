import { Template } from 'meteor/templating';
import { getCurrencyDetails } from '../../modules/currencies/currencies.js';

Template.registerHelper('currencySymbol', function currencySymbol(...args) {
  let result;

  // enables the arguments to be provided as args or vars
  const kw = args.pop();

  const currencyCode = args[0] || kw.hash.currencyCode;
  const currencyDetails = getCurrencyDetails(currencyCode);

  if (currencyDetails) {
    result = currencyDetails.symbol;
  }

  return result;
});

Template.registerHelper('currency', number => `£${number.toFixed(2)}`);
