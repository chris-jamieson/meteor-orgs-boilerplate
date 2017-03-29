import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { Bert } from 'meteor/themeteorchef:bert';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

import './users-profile.html';

import '../../helpers/string-helpers.js';

Template.usersProfile.onCreated(function usersProfileOnCreated() {
  const instance = this;
  instance.profileUpdating = new ReactiveVar(false);
  instance.preferencesUpdating = new ReactiveVar(false);
  instance.addEmailAddressFieldVisible = new ReactiveVar(false);
  instance.newEmailAddressSaving = new ReactiveVar(false);
});

Template.usersProfile.helpers({
  user() {
    return Meteor.user();
  },
  profileUpdating() {
    return Template.instance().profileUpdating.get();
  },
  preferencesUpdating() {
    return Template.instance().preferencesUpdating.get();
  },
  addEmailAddressFieldVisible() {
    return Template.instance().addEmailAddressFieldVisible.get();
  },
  newEmailAddressSaving() {
    return Template.instance().newEmailAddressSaving.get();
  },
});

Template.usersProfile.events({
  'submit #updateUserProfileForm': (event, template) => {
    event.preventDefault();
    template.profileUpdating.set(true);
    const profile = {
      firstName: template.find('#profileFirstName').value,
      lastName: template.find('#profileLastName').value,
    };

    Meteor.call('users.updateProfile', profile, (error, result) => {
      template.profileUpdating.set(false);
      if (error) {
        Bert.alert({
          title: 'Error updating profile',
          message: error.reason,
          type: 'danger',
          style: 'fixed-bottom',
          icon: 'fa-user',
        });
      }

      if (result) {
        Bert.alert({
          title: 'Profile updated',
          type: 'success',
          style: 'fixed-bottom',
          icon: 'fa-user',
        });
      }
    });
  },
  'submit #updateUserPreferencesForm': (event, template) => {
    event.preventDefault();
    template.preferencesUpdating.set(true);
    const preferences = {
      showTransactionLocationField: template.find('#showTransactionLocationField').checked,
    };

    Meteor.call('users.updatePreferences', preferences, (error, result) => {
      template.preferencesUpdating.set(false);
      if (error) {
        Bert.alert({
          title: 'Error updating preferences',
          message: error.reason,
          type: 'danger',
          style: 'fixed-bottom',
          icon: 'fa-sliders',
        });
      }

      if (result) {
        Bert.alert({
          title: 'Preferences updated',
          type: 'success',
          style: 'fixed-bottom',
          icon: 'fa-sliders',
        });
      }
    });
  },
  'click button[name="show-portrait-edit-modal"]': (event) => {
    event.preventDefault();
    Modal.show('portraitEditModal');
  },
  'click button[name="show-add-email-address-field"]': (event, template) => {
    event.preventDefault();
    template.addEmailAddressFieldVisible.set(true);
  },
  'click button[name="save-new-email-address"]': (event, template) => {
    event.preventDefault();
    template.newEmailAddressSaving.set(true);

    const emailAddress = template.find('#new-email-address').value;

    Meteor.call('users.addEmail', { emailAddress }, (error, result) => {
      template.newEmailAddressSaving.set(false);
      if (error) {
        Bert.alert({
          title: 'Error adding email address',
          message: error.reason,
          type: 'danger',
          style: 'fixed-bottom',
          icon: 'fa-envelope',
        });
      }

      if (result) {
        Bert.alert({
          title: 'Email address added',
          type: 'success',
          style: 'fixed-bottom',
          icon: 'fa-envelope',
        });

        // clear the field and hide it
        template.$('#new-email-address').val();
        template.addEmailAddressFieldVisible.set(false);
      }
    });
  },
  'click button[name="remove-email-address"]': (event, template) => {
    event.preventDefault();
    const emailAddress = template.$(event.target).closest('button').data('email-address');

    Meteor.call('users.removeEmail', { emailAddress }, (error, result) => {
      if (error) {
        Bert.alert({
          title: 'Error removing email address',
          message: error.reason,
          type: 'danger',
          style: 'fixed-bottom',
          icon: 'fa-envelope',
        });
      }

      if (result) {
        Bert.alert({
          title: 'Email address removed',
          type: 'success',
          style: 'fixed-bottom',
          icon: 'fa-envelope',
        });
      }
    });
  },
  'click button[name="verify-email-address"]': (event, template) => {
    event.preventDefault();
    const emailAddress = template.$(event.target).closest('button').data('email-address');

    Meteor.call('users.sendVerificationEmail', { emailAddress }, (error, result) => {
      if (error) {
        Bert.alert({
          title: 'Error verifying email address',
          message: error.reason,
          type: 'danger',
          style: 'fixed-bottom',
          icon: 'fa-envelope',
        });
      }

      if (result) {
        Bert.alert({
          title: 'Email address verification email sent',
          message: 'Please check your email for further information',
          type: 'success',
          style: 'fixed-bottom',
          icon: 'fa-envelope',
        });
      }
    });
  },
});
