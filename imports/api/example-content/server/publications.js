import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { ExampleContent } from '../example-content';
import { Organisations } from '../../organisations/organisations';

// eslint-disable-next-line consistent-return
Meteor.publish('exampleContent.single', function publishExampleContent(exampleContentId) {
  check(exampleContentId, String);

  if (!this.userId) {
    return this.ready();
  }

  const options = { fields: { organisationId: true } };
  const exampleContent = ExampleContent.findOne({ _id: exampleContentId }, options) || {};
  const { organisationId = '' } = exampleContent;

  const organisation = Organisations.findOne({ _id: organisationId });
  const allowedRoles = ['owner', 'administrator', 'manager', 'viewer'];

  if (!organisation) {
    return this.ready();
  }

  if (organisation.userHasRoleInOrganisation(this.userId, allowedRoles)) {
    return ExampleContent.find({
      _id: exampleContentId,
    }, { fields: ExampleContent.publicFields });
  }

  this.ready();
});

// eslint-disable-next-line consistent-return
Meteor.publish('exampleContent.inOrganisation', function publishExampleContent(organisationId) {
  check(organisationId, String);

  if (!this.userId) {
    throw new Meteor.Error('exampleContent.unauthorized',
      'You must be logged in to subscribe to exampleContent.');
  }

  const organisation = Organisations.findOne({ _id: organisationId });
  const allowedRoles = ['owner', 'administrator', 'manager', 'viewer'];

  if (!organisation) {
    throw new Meteor.Error('exampleContent.notFound',
      'The requested organisation could not be found.');
  }

  if (organisation.userHasRoleInOrganisation(this.userId, allowedRoles)) {
    return ExampleContent.find({
      organisationId,
    }, { fields: ExampleContent.publicFields });
  }

  this.ready();
});
