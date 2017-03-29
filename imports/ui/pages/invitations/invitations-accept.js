import { Meteor } from 'meteor/meteor'; 
import { Template } from 'meteor/templating'; 
import { Session } from 'meteor/session'; 
import { FlowRouter } from 'meteor/kadira:flow-router'; 
import { ReactiveVar } from 'meteor/reactive-var'; 
import './invitations-accept.html';

Template.invitationsAccept.onCreated(function invitationsAcceptOnCreated() {
  const instance = this;

  const invitationId = FlowRouter.getParam('invitationId');
  const emailAddress = FlowRouter.getQueryParam('emailAddress');
  const token = FlowRouter.getQueryParam('token');

  instance.invitationAccepting = new ReactiveVar(false);
  Session.set('invitationAcceptResult', false);
  Session.set('invitation', false);

  // try to load the invitation (if permitted)
  instance.invitationLoading = new ReactiveVar(true);
  Meteor.call('invitations.load', { invitationId, emailAddress, token }, (methodError, result) => {
    instance.invitationLoading.set(false);
    if (methodError) {
      console.log('error: ', methodError); // TODO remove
      Session.set('invitationLoadingError', methodError);
    } else {
      Session.set('invitation', result);
    }
  });
});

Template.invitationsAccept.helpers({
  invitation() {
    const invitation = Session.get('invitation');
    return invitation;
  },
  invitationLoading() {
    const invitationLoading = Template.instance().invitationLoading.get();
    return invitationLoading;
  },
  invitationLoadingError() {
    const invitationLoadingError = Session.get('invitationLoadingError');
    return invitationLoadingError;
  },
  invitationAccepting() {
    const invitationAccepting = Template.instance().invitationAccepting.get();
    return invitationAccepting;
  },
  invitationAcceptResult() {
    const invitationAcceptResult = Session.get('invitationAcceptResult');
    return invitationAcceptResult;
  },
});

Template.invitationsAccept.events({
  'submit form#invitationAccept': function invitationAccept(event, template) {
    event.preventDefault();
    const invitationId = event.target.invitationId.value;
    const emailAddress = event.target.emailAddress.value;
    const token = event.target.token.value;

    template.invitationAccepting.set(true);
    Meteor.call('invitations.accept', { invitationId, emailAddress, token }, (methodError, result) => {
      template.invitationAccepting.set(false);
      if (methodError) {
        console.log('error: ', methodError); // TODO remove
        // TODO fire Bert warning
      } else {
        Session.set('invitationAcceptResult', result);
        console.log('result: ', result); // TODO remove
      }
    });
  },
});
