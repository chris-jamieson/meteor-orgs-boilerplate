import { AutoForm } from 'meteor/aldeed:autoform';
import { Bert } from 'meteor/themeteorchef:bert';
import { FlowRouter } from 'meteor/kadira:flow-router';

AutoForm.hooks({
  insertOrganisationForm: {
    onError(formType, error) {
      Bert.alert({
        title: 'Error creating organisation',
        message: error.message,
        type: 'warning',
        style: 'fixed-bottom',
        icon: 'fa-check',
      });
    },

    after: {
      method(error, result) {
        if (!error) {
          Bert.alert({
            title: 'Organisation created',
            type: 'success',
            style: 'fixed-bottom',
            icon: 'fa-building-o',
          });

          FlowRouter.go('organisations.settings', { organisationId: result });
        }
      },
    },
  },
});
