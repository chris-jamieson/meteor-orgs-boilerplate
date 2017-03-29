/* eslint-disable prefer-arrow-callback */
import { Meteor } from 'meteor/meteor'; 
import { check } from 'meteor/check'; 
import { Organisations } from '../../../api/organisations/organisations';
import { Invitations } from '../../../api/invitations/invitations';

Meteor.publish('invitations.toOrganisation', function publishInvitationsToOrganisation(organisationId) {
  check(organisationId, String);
  if (!this.userId) {
    return this.ready();
  }

  const organisation = Organisations.findOne({ _id: organisationId });

  if (!organisation.userHasRoleInOrganisation(this.userId, ['owner', 'administrator'])) {
    return this.stop();
  }

  return Invitations.find({ organisationId }, { fields: { token: 0 } });
});
