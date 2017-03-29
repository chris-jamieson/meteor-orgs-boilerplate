import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { _ } from 'meteor/underscore';
import SimpleSchema from 'simpl-schema';
import { getAllCurrencies } from '../../modules/currencies/currencies';

SimpleSchema.extendOptions(['autoform']);

// eslint-disable-next-line import/prefer-default-export
export const Organisations = new Mongo.Collection('organisations');

Organisations.schema = new SimpleSchema({
  name: {
    type: String,
    label: 'Name',
    autoform: {
      placeholder: 'A to B Distribution Services',
    },
  },
  currency: {
    type: String,
    defaultValue: 'GBP',
    allowedValues() {
      const currencies = getAllCurrencies();
      return Object.keys(currencies);
    },
    autoform: {
      options() {
        const currencies = getAllCurrencies();
        const labelValues = _.map(currencies, (currency, key) => { // eslint-disable-line no-unused-vars
          const item = {};
          item.label = currency.name;
          item.value = currency.code;
          return item;
        });
        return labelValues;
      },
    },
  },
  logo: {
    type: String,
    label: 'Company logo',
    optional: true,
    autoform: {
      type: 'imageCameraField',
      afFieldInput: {
        data: {
          metaContext: {
            collection: 'organisations',
            fieldName: 'logo',
          },
        },
      },
    },
  },
  users: {
    label: 'Users',
    type: Array,
    optional: true,
  },
  'users.$': {
    label: 'User',
    type: Object,
  },
  'users.$.id': {
    label: 'User ID',
    type: String,
  },
  'users.$.role': {
    label: 'User role',
    type: String,
    allowedValues: ['owner', 'administrator', 'manager', 'viewer'],
  },
  createdAt: {
    type: Date,
    optional: true,
  },
  updatedAt: {
    type: Date,
    optional: true,
  },
  createdBy: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
  },
});

Organisations.attachSchema(Organisations.schema);

Organisations.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Organisations.helpers({
  userAccounts() {
    const organisationUserIds = _.pluck(this.users, 'id');
    return Meteor.users.find({ _id: { $in: organisationUserIds } });
  },
  userIsInOrganisation(userId) {
    let inOrg = false;

    inOrg = _.some(this.users, (orgUser) => {
      if (orgUser.id === userId) {
        return true;
      }
    });

    return inOrg;
  },
  userHasRoleInOrganisation(userId, roles) {
    let hasRole = false;
    // support single string or array of strings for roles
    let rolesArray = roles;
    if (!_.isArray(rolesArray)) {
      rolesArray = [roles];
    }

    const matches = _.filter(this.users, (orgUser) => {
      if (orgUser.id === userId) {
        if (_.contains(rolesArray, orgUser.role)) {
          return true;
        }
      }
    });

    if (matches.length > 0) {
      hasRole = true;
    }

    return hasRole;
  },
});

Organisations.before.insert((userId, doc) => {
  doc.createdAt = new Date(); // eslint-disable-line no-param-reassign
  doc.users = [{ // eslint-disable-line no-param-reassign
    id: userId,
    role: 'owner',
  }];
  if (doc.updatedAt) {
    delete doc.updatedAt; // eslint-disable-line no-param-reassign
  }
});

Organisations.before.update((userId, doc, fieldNames, modifier, options) => { // eslint-disable-line no-unused-vars
  modifier.$set = modifier.$set || {}; // eslint-disable-line no-param-reassign
  modifier.$set.updatedAt = new Date(); // eslint-disable-line no-param-reassign
  if (modifier.$set.createdAt) {
    delete modifier.$set.createdAt; // eslint-disable-line no-param-reassign
  }
  if (modifier.$set.createdBy) {
    delete modifier.$set.createdBy; // eslint-disable-line no-param-reassign
  }
});
