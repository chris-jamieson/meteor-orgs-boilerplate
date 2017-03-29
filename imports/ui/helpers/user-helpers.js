import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

Template.registerHelper('userDetail', (args) => {
  let field = null;

  if (args && args.hash) {
    const userId = args.hash.userId;
    const fieldName = args.hash.field;

    if (userId) {
      const user = Meteor.users.findOne({ _id: userId });
      field = user[fieldName];
    }
  }

  return field;
});

Template.registerHelper('userProfileDetail', (args) => {
  let field = null;

  if (args && args.hash) {
    const userId = args.hash.userId;
    const fieldName = args.hash.field;

    if (userId) {
      const user = Meteor.users.findOne({ _id: userId });
      field = user.profile[fieldName];
    }
  }

  return field;
});

Template.registerHelper('userEmailsDetail', (args) => {
  let field = null;

  if (args && args.hash) {
    const userId = args.hash.userId;
    const emailKey = args.hash.emailKey;
    const fieldName = args.hash.field;

    if (userId) {
      const user = Meteor.users.findOne({ _id: userId });
      field = user.emails[emailKey][fieldName];
    }
  }

  return field;
});
