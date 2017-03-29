import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Bert } from 'meteor/themeteorchef:bert';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import { Session } from 'meteor/session';
import { $ } from 'meteor/jquery';
import { _ } from 'meteor/underscore';
import { moment } from 'meteor/momentjs:moment';
import './organisations-settings.html';
import { Organisations } from '../../../api/organisations/organisations';
import { Invitations } from '../../../api/invitations/invitations';
import './organisations-settings-autoform-hooks';
import '../../helpers/user-helpers';
import '../../layouts/modals/organisations-user-add-modal';

Template.organisationsSettings.onCreated(function organisationsSettingsOnCreated() {
  const instance = this;

  const organisationId = FlowRouter.getParam('organisationId');
  instance.subscribe('organisations.single', organisationId);
  instance.subscribe('invitations.toOrganisation', organisationId);

  Session.set('resendingInvitationIds', []);
});

Template.organisationsSettings.helpers({
  organisation() {
    const organisationId = FlowRouter.getParam('organisationId');
    const organisation = Organisations.findOne({ _id: organisationId });
    return organisation;
  },
  organisationsCollection() {
    return Organisations;
  },
  organisationPendingInvitations() {
    const organisationId = FlowRouter.getParam('organisationId');
    const now = moment().toDate();
    const invitations = Invitations.find({ organisationId, isUsed: { $ne: true }, expiresAt: { $gt: now } });
    return invitations;
  },
  invitationResending(invitationId) {
    let resending = false;
    const resendingInvitationIds = Session.get('resendingInvitationIds');
    if (_.contains(resendingInvitationIds, invitationId)) {
      resending = true;
    }
    return resending;
  },
});

Template.organisationsSettings.events({
  'click button[name="show-organisation-user-add-modal"]': (event, template) => {
    const organisationId = FlowRouter.getParam('organisationId');
    const dataContext = {
      organisationId,
    };
    Modal.show('organisationsUserAddModal', dataContext);
  },
  'click button[name="resend-invitation"]': (event, template) => {
    const invitationId = $(event.target).data('invitation-id');
    let resendingInvitationIds = Session.get('resendingInvitationIds');
    resendingInvitationIds.push(invitationId);
    Session.set('resendingInvitationIds', resendingInvitationIds);

    Meteor.call('invitations.sendInviteEmail', { invitationId }, (err, result) => {
      resendingInvitationIds = Session.get('resendingInvitationIds');
      resendingInvitationIds = _.without(resendingInvitationIds, invitationId);
      Session.set('resendingInvitationIds', resendingInvitationIds);

      if (err) {
        Bert.alert({
          title: 'Error resending invitation',
          message: 'Please try again',
          type: 'warning',
          style: 'fixed-bottom',
          icon: 'fa-frown-o',
        });
      } else {
        Bert.alert({
          title: 'Invitation resent',
          type: 'success',
          style: 'fixed-bottom',
          icon: 'fa-smile-o',
        });
      }
    });
  },
});
