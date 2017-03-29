import { Meteor } from 'meteor/meteor'; 
import { ValidatedMethod } from 'meteor/mdg:validated-method'; 
import SimpleSchema from 'simpl-schema';
import { Accounts } from 'meteor/accounts-base'; 

export const updateProfile = new ValidatedMethod({
  name: 'users.updateProfile',
  validate: new SimpleSchema({
    firstName: { type: String, optional: true },
    lastName: { type: String, optional: true },
  }).validator(),
  run(fields) {
    const profile = fields;
    if (!this.userId) {
      throw new Meteor.Error('users.updateProfile.accessDenied',
        'Cannot update user profile unless logged in');
    }

    return Meteor.users.update({ _id: this.userId },
      { $set: { profile, updatedAt: new Date() } });
  },
});

export const updatePortrait = new ValidatedMethod({
  name: 'users.updatePortrait',
  validate: new SimpleSchema({
    imageUrl: { type: String },
  }).validator(),
  run(fields) {
    const portrait = fields.imageUrl;
    if (!this.userId) {
      throw new Meteor.Error('users.updateProfile.accessDenied',
        'Cannot update user profile unless logged in');
    }

    return Meteor.users.update({ _id: this.userId }, { $set: { portrait, updatedAt: new Date() } });
  },
});

export const addEmail = new ValidatedMethod({
  name: 'users.addEmail',
  validate: new SimpleSchema({
    emailAddress: { type: String },
  }).validator(),
  run(fields) {
    const newEmail = fields.emailAddress;
    if (!this.userId) {
      throw new Meteor.Error('users.addEmail.accessDenied',
        'Cannot update user profile unless logged in');
    }

    let addSucceeded = false;
    try {
      Accounts.addEmail(this.userId, newEmail);
      addSucceeded = true;
    } catch (e) {
      // take no action
    }

    if (!addSucceeded) {
      throw new Meteor.Error('users.addEmail.addFailed',
        'Email address already in use');
    } else {
      Accounts.sendVerificationEmail(this.userId, newEmail);
      return true;
    }
  },
});

export const removeEmail = new ValidatedMethod({
  name: 'users.removeEmail',
  validate: new SimpleSchema({
    emailAddress: { type: String },
  }).validator(),
  run(fields) {
    const email = fields.emailAddress;
    if (!this.userId) {
      throw new Meteor.Error('users.removeEmail.accessDenied',
        'Cannot update user profile unless logged in');
    }

    let removeSucceeded = false;
    try {
      Accounts.removeEmail(this.userId, email);
      removeSucceeded = true;
    } catch (e) {
      // take no action
    }

    if (!removeSucceeded) {
      throw new Meteor.Error('users.removeEmail.removeFailed',
        'Email address cannot be removed');
    } else {
      return true;
    }
  },
});

export const sendVerificationEmail = new ValidatedMethod({
  name: 'users.sendVerificationEmail',
  validate: new SimpleSchema({
    emailAddress: { type: String },
  }).validator(),
  run(fields) {
    const email = fields.emailAddress;
    if (!this.userId) {
      throw new Meteor.Error('users.sendVerificationEmail.accessDenied',
        'Cannot update user profile unless logged in');
    }

    let sendSucceeded = false;
    try {
      Accounts.sendVerificationEmail(this.userId, email);
      sendSucceeded = true;
    } catch (e) {
      // take no action
    }

    if (!sendSucceeded) {
      throw new Meteor.Error('users.sendVerificationEmail.removeFailed',
        'Email address verification email failed to send');
    } else {
      return true;
    }
  },
});
