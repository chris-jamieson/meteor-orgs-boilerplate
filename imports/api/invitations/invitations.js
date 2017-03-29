import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { moment } from 'meteor/momentjs:moment';
import SimpleSchema from 'simpl-schema';

SimpleSchema.extendOptions(['autoform']);

// eslint-disable-next-line import/prefer-default-export
export const Invitations = new Mongo.Collection('invitations');

Invitations.schema = new SimpleSchema({
  emailAddress: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    autoform: {
      placeholder: 'mary.smith@cubbon-giles.org',
    },
  },
  firstName: {
    type: String,
    optional: true,
    autoform: {
      placeholder: 'Mary',
    },
  },
  lastName: {
    type: String,
    optional: true,
    autoform: {
      placeholder: 'Smith',
    },
  },
  expiresAt: {
    type: Date,
    optional: true, // when creating
  },
  token: {
    type: String,
    optional: true, // when creating
  },
  isUsed: {
    type: Boolean,
    optional: true, // when creating
  },
  organisationId: {
    type: String,
    label: 'Organisation ID',
  },
  organisationRole: {
    type: String,
    label: 'Organisation Role',
    allowedValues: ['owner', 'administrator', 'manager', 'viewer'],
    optional: true,
  },
  createdAt: {
    type: Date,
    optional: true, // when creating
  },
  updatedAt: {
    type: Date,
    optional: true,
  },
  createdBy: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true, // when creating
  },
});

Invitations.attachSchema(Invitations.schema);

Invitations.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Invitations.helpers({
  isExpired() {
    let isExpired = true;
    if (this.expiresAt) {
      const now = moment();
      if (moment(this.expiresAt).isAfter(now)) {
        isExpired = false;
      }
    }
    return isExpired;
  },
});

Invitations.after.insert((userId, doc) => {
  // send email to the invitee
  Meteor.call('invitations.sendInviteEmail', { invitationId: doc._id });
});
