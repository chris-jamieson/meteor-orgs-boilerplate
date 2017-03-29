import { Template } from 'meteor/templating';

Template.registerHelper('hasOrganisationRole', (args) => {
  if (args && args.hash) {
    const userId = args.hash.userId;
    const orgUsers = args.hash.organisation && args.hash.organisation.users || [];
    const rolesArray = args.hash.roles.split(',');

    const foundUser = orgUsers.find(user => user.id === userId) || {};
    if (rolesArray.includes(foundUser.role)) {
      return true;
    }
  }
  return false;
});
