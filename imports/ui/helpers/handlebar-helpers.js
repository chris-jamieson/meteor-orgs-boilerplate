import { Template } from 'meteor/templating';
import { _ } from 'meteor/underscore';

Template.registerHelper('$all', (...args) => {
  let test = args[0];
  if (!args.length) {
    return false;
  }
  if (args.length > 1) {
    _.each(_.rest(args), (arg) => {
      test = test && arg;
    });
  }
  return test;
});
