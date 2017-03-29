import { Template } from 'meteor/templating';

Template.registerHelper('strToLowerCase', (string) => {
  let output = '';

  if (typeof string === 'string') {
    output = string.toLowerCase();
  }

  return output;
});
