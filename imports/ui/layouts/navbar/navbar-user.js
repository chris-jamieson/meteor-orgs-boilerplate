import './navbar-user.html';

import { Template } from 'meteor/templating';
import { AccountsTemplates } from 'meteor/useraccounts:core';

Template.Navbar_user.events({
  'click .sign-out'(event) {
    event.preventDefault();
    AccountsTemplates.logout();
  },
});
