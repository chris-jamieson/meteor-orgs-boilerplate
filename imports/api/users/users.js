import { Meteor } from 'meteor/meteor'; 
import SimpleSchema from 'simpl-schema';

SimpleSchema.extendOptions(['autoform']);

export const Users = Meteor.users;

export const UserProfile = new SimpleSchema({
  firstName: {
    type: String,
    optional: true,
  },
  lastName: {
    type: String,
    optional: true,
  },
});

export const UserSchema = new SimpleSchema({
  username: {
    type: String,
    regEx: /^[a-z0-9A-Z_]{3,15}$/,
    optional: true,
  },
  emails: {
    type: Array,
  },
  'emails.$': {
    type: Object,
  },
  'emails.$.address': {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
  },
  'emails.$.verified': {
    type: Boolean,
  },
  mobilePhoneNumber: {
    type: String,
    label: 'Mobile phone number',
    autoform: {
      type: 'intl-tel',
      class: 'form-control',
      intlTelOptions: {
        autoFormat: true,
        defaultCountry: 'GB',
      },
    },
    optional: true,
  },
  createdAt: {
    type: Date,
  },
  profile: {
    type: UserProfile,
    optional: true,
  },
  portrait: {
    type: String,
    optional: true,
    label: 'Profile photo',
    autoform: {
      type: 'imageCameraField',
      afFieldInput: {
        data: {
          metaContext: {
            collection: 'users',
            fieldName: 'portrait',
          },
        },
      },
    },
  },
  status: {
    type: Object,
    blackbox: true, // set by mizzao:user-status package
    optional: true, // for creation
  },
  // token set by https://atmospherejs.com/gwendall/impersonate package
  _impersonateToken: {
    type: String,
    optional: true,
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true,
  },
  // Add `roles` to your schema if you use the meteor-roles package.
  // Option 1: Object type
  // If you specify that type as Object, you must also specify the
  // `Roles.GLOBAL_GROUP` group whenever you add a user to a role.
  // Example:
  // Roles.addUsersToRoles(userId, ["admin"], Roles.GLOBAL_GROUP);
  // You can't mix and match adding with and without a group since
  // you will fail validation in some cases.
  roles: {
    type: Object,
    optional: true,
    blackbox: true,
  },
});

Users.attachSchema(UserSchema);
