import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { Random } from 'meteor/random';

Meteor.startup(() => {
  // create an admin user if one does not exist
  const adminEmailAddress = 'admin@yourdomain.co.uk'; // TODO set this as preferred
  const adminUser = Meteor.users.findOne({
    'emails.address': adminEmailAddress,
  });

  const adminRoles = ['admin'];
  let adminUserId;

  if (adminUser) {
    adminUserId = adminUser._id;
  } else {
    const adminPassword = Random.id();
    adminUserId = Accounts.createUser({
      email: adminEmailAddress,
      password: adminPassword,
    });

    if (adminUserId) {
      console.log('=======\nAdmin user created!\nEmail address: ',
      adminEmailAddress, '\nPassword: ', adminPassword, '\n=====');
    }
  }

  if (adminRoles.length > 0) {
    Roles.addUsersToRoles(adminUserId, adminRoles, Roles.GLOBAL_GROUP);
  }
});
