import { Template } from 'meteor/templating';

import './navbar-admin.html';

Template.Navbar_admin.events({
  'click .open-impersonate-modal'(event, template) {
    event.preventDefault();

    Modal.show('adminImpersonateUsersModal');
  },
});
