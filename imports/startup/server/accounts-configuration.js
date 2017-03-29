import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Accounts.config({
  sendVerificationEmail: true,
});

Accounts.emailTemplates.siteName = 'Orgs Boilerplate'; // TODO replace with app name

Accounts.emailTemplates.from = 'Site Admin <noreply@example.com>'; // TODO replace with app domain

Accounts.emailTemplates.resetPassword.subject = function resetPasswordSubject() {
  return 'How to reset your Site password'; // TODO set app name
};

Accounts.onCreateUser((options, user) => {
  const createdUser = user;

  createdUser.profile = options.profile || {};

  return createdUser;
});

// Reset password endpoint
Accounts.urls.resetPassword = token => Meteor.absoluteUrl(`reset-password/${token}`);

// Verify email endpoint
Accounts.urls.verifyEmail = token => Meteor.absoluteUrl(`verify-email/${token}`);

// Enroll account endpoint
Accounts.urls.enrollAccount = token => Meteor.absoluteUrl(`enroll-account/${token}`);
