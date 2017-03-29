import { Meteor } from 'meteor/meteor';
import { AccountsTemplates } from 'meteor/useraccounts:core';
import { FlowRouter } from 'meteor/kadira:flow-router';

const logoutCallback = () => {
  FlowRouter.go('/sign-in');
};

AccountsTemplates.configure({
  texts: {
    errors: {
      accountsCreationDisabled: 'Client side accounts creation is disabled!',
      cannotRemoveService: 'Cannot remove the only active service!',
      captchaVerification: 'Captcha verification failed!',
      loginForbidden: 'error.accounts.Login forbidden',
      mustBeLoggedIn: 'error.accounts.Please log in for access.',
      pwdMismatch: 'error.pwdsDontMatch',
      validationErrors: 'Validation Errors',
      verifyEmailFirst: 'Please verify your email first. Check the email and follow the link!',
    },
  },
  defaultLayoutType: 'blaze',
  defaultTemplate: '',
  defaultLayout: 'App_body',
  defaultContentRegion: 'main',
  defaultLayoutRegions: {},
  showForgotPasswordLink: true,
  homeRoutePath: '/dashboard',
  onLogoutHook: logoutCallback,
  confirmPassword: false,
  enablePasswordChange: true,
});

AccountsTemplates.addFields([
  {
    _id: 'firstName',
    type: 'text',
    displayName: 'First name',
    placeholder: 'Jane',
  },
  {
    _id: 'lastName',
    type: 'text',
    displayName: 'Last name',
    placeholder: 'Smith',
  },
]);
