import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';
import { ExampleContent } from '../example-content';
import { Organisations } from '../../organisations/organisations';

const insert = new ValidatedMethod({
  name: 'exampleContent.insert',
  validate: ExampleContent.insertSchema.validator(),
  run(doc) {
    const loggedInUserId = this.userId;
    if (!loggedInUserId) {
      throw new Meteor.Error('exampleContent.insert.accessDenied',
        'Cannot create exampleContent unless logged in');
    }

    const organisation = Organisations.findOne({ _id: doc.organisationId });
    if (!organisation) {
      throw new Meteor.Error('exampleContent.insert.organisationNotFound',
        'The referenced organisation was not found');
    }

    // check user has role in org
    const allowedOrgRoles = ['owner', 'administrator'];
    if (!organisation.userHasRoleInOrganisation(loggedInUserId, allowedOrgRoles)) {
      throw new Meteor.Error('exampleContent.insert.insufficientOrganisationRole',
        'This user does not have the necessary role within the organisation.');
    }

    doc.createdAt = new Date();
    doc.createdBy = loggedInUserId;

    return ExampleContent.insert(doc);
  },
});

const update = new ValidatedMethod({
  name: 'exampleContent.update',
  validate: ExampleContent.updateSchema.validator(),
  run(doc) {
    const loggedInUserId = this.userId;
    if (!loggedInUserId) {
      throw new Meteor.Error('exampleContent.update.accessDenied',
        'Cannot create exampleContent unless logged in');
    }

    const organisation = Organisations.findOne({ _id: doc.organisationId });
    if (!organisation) {
      throw new Meteor.Error('exampleContent.update.organisationNotFound',
        'The referenced organisation was not found');
    }

    // check user has role in org
    const allowedOrgRoles = ['owner', 'administrator'];
    if (!organisation.userHasRoleInOrganisation(loggedInUserId, allowedOrgRoles)) {
      throw new Meteor.Error('exampleContent.update.insufficientOrganisationRole',
        'This user does not have the necessary role within the organisation.');
    }

    doc.updatedAt = new Date();

    const { _id, organisationId, ...rest } = doc;

    return ExampleContent.update({ _id, organisationId }, { $set: rest });
  },
});

const remove = new ValidatedMethod({
  name: 'exampleContent.remove',
  validate: new SimpleSchema({
    _id: { type: String, regEx: SimpleSchema.RegEx.Id },
    organisationId: { type: String, regEx: SimpleSchema.RegEx.Id },
  }).validator(),
  run(doc) {
    const loggedInUserId = this.userId;
    if (!loggedInUserId) {
      throw new Meteor.Error('exampleContent.remove.accessDenied',
        'Cannot create exampleContent unless logged in');
    }

    const organisation = Organisations.findOne({ _id: doc.organisationId });
    if (!organisation) {
      throw new Meteor.Error('exampleContent.remove.organisationNotFound',
        'The referenced organisation was not found');
    }

    // check user has role in org
    const allowedOrgRoles = ['owner', 'administrator'];
    if (!organisation.userHasRoleInOrganisation(loggedInUserId, allowedOrgRoles)) {
      throw new Meteor.Error('exampleContent.remove.insufficientOrganisationRole',
        'This user does not have the necessary role within the organisation.');
    }

    return ExampleContent.remove({ _id: doc._id });
  },
});

export { insert, update, remove };
