import { Meteor } from 'meteor/meteor'; 
import { ValidatedMethod } from 'meteor/mdg:validated-method'; 
import SimpleSchema from 'simpl-schema';
import { Organisations } from '../organisations';

const insert = new ValidatedMethod({
  name: 'organisations.insert',
  validate: new SimpleSchema({
    name: { type: String },
    currency: { type: String },
  }).validator(),
  run(fields) {
    const organisation = fields;
    if (!this.userId) {
      throw new Meteor.Error('organisations.insert.accessDenied',
        'Cannot create organisations unless logged in');
    }

    organisation.createdBy = this.userId;

    return Organisations.insert(organisation);
  },
});

const update = new ValidatedMethod({
  name: 'organisations.update',
  validate: new SimpleSchema({
    _id: { type: String },
    modifier: { type: Object, blackbox: true },
  }).validator(),
  run(args) {
    const loggedInUserId = this.userId;
    if (!loggedInUserId) {
      throw new Meteor.Error('organisations.update.accessDenied',
        'Cannot update organisations unless logged in');
    }

    const organisation = Organisations.findOne({ _id: args._id });
    if (organisation) {
      const allowedOrgRoles = ['owner', 'administrator'];
      if (!organisation.userHasRoleInOrganisation(loggedInUserId, allowedOrgRoles)) {
        throw new Meteor.Error('paymentDevices.update.insufficientOrganisationRole',
          'This user does not have the necessary role within the organisation.');
      }
    } else {
      throw new Meteor.Error('paymentDevices.update.organisationNotFound',
        'The organisation ID provided was not found.');
    }

    return Organisations.update({ _id: args._id }, args.modifier);
  },
});

export { insert, update };
