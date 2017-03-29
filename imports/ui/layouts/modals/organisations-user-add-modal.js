import './organisations-user-add-modal.html';

import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { capitalize } from 'underscore.string';

import { Organisations } from '../../../api/organisations/organisations.js';
import { Invitations } from '../../../api/invitations/invitations.js';

import './organisations-user-add-modal-autoform-hooks.js';

Template.organisationsUserAddModal.onCreated(function organisationsGroupAddModalOnCreated() {
  const instance = this;

  let organisationId;
  const templateData = Template.currentData();
  if (templateData) {
    organisationId = templateData.organisationId;
  }

  instance.subscribe('organisations.single', organisationId);
});

Template.organisationsUserAddModal.helpers({
  invitationsSchema() {
    return Invitations.schema;
  },
  organisationRoleOptions() {
    let organisationRoleOptions = [];

    const userId = Meteor.userId();
    let organisationId;
    const templateData = Template.currentData();
    if (templateData) {
      organisationId = templateData.organisationId;
      const organisation = Organisations.findOne({ _id: organisationId });

      if (organisation) {
        // available options depend on the current user's role in this org
        if (organisation.userHasRoleInOrganisation(userId, 'owner')) {
          organisationRoleOptions = ['owner', 'administrator', 'manager', 'viewer'];
        } else if (organisation.userHasRoleInOrganisation(userId, 'administrator')) {
          organisationRoleOptions = ['administrator', 'manager', 'viewer'];
        } else if (organisation.userHasRoleInOrganisation(userId, 'manager')) {
          organisationRoleOptions = ['manager', 'viewer'];
        } else if (organisation.userHasRoleInOrganisation(userId, 'viewer')) {
          organisationRoleOptions = ['viewer'];
        }
      }
    }

    organisationRoleOptions = _.map(organisationRoleOptions, (roleName) => {
      return {
        value: roleName,
        label: capitalize(roleName),
      };
    });
    return organisationRoleOptions;
  },
});
