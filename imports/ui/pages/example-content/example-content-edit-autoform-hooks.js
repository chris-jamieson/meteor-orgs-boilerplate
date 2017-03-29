import { FlowRouter } from 'meteor/kadira:flow-router'; // eslint-disable-line import/no-extraneous-dependencies, import/extensions
import { AutoForm } from 'meteor/aldeed:autoform'; // eslint-disable-line import/no-extraneous-dependencies, import/extensions
import { Bert } from 'meteor/themeteorchef:bert'; // eslint-disable-line import/no-extraneous-dependencies, import/extensions

AutoForm.hooks({
  updateExampleContentForm: {
    onError(formType, error) {
      Bert.alert({
        title: 'Error updating example content',
        message: error.reason,
        type: 'warning',
        style: 'fixed-bottom',
        icon: 'fa-user-o',
      });
    },

    after: {
      method(error, result) {
        if (!error) {
          Bert.alert({
            title: 'Example content updated',
            type: 'success',
            style: 'fixed-bottom',
            icon: 'fa-user-o',
          });

          const organisationId = FlowRouter.getParam('organisationId');
          FlowRouter.go('organisations.dashboard', { organisationId });
        }
      },
    },
  },
});
