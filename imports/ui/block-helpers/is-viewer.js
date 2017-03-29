import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Organisations } from '../../api/organisations/organisations.js';
import './is-viewer.html';

Template.isViewer.onCreated(() => {
  const organisationId = Template.currentData().organisationId;
  if (! organisationId) {
    throw new Error('organisationId is required for isViewer block helper');
  }
  Template.instance().subscribe('organisations.single', organisationId);
});

Template.isViewer.helpers({
  isViewer() {
    const organisationId = Template.currentData().organisationId;
    if (! organisationId) {
      throw new Error('organisationId is required for isViewer block helper');
    }
    const organisation = Organisations.findOne({ _id: organisationId }) || {};
    const orgUsers = organisation.users || [];
    return !! orgUsers.find(user =>
      user.id === Meteor.userId() && user.role === 'viewer');
  },
});
