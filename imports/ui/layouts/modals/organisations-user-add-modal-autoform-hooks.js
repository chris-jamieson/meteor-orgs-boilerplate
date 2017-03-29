import { AutoForm } from 'meteor/aldeed:autoform';
import { Bert } from 'meteor/themeteorchef:bert';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

AutoForm.hooks({
  insertOrganisationInvitationForm: {
    onError(formType, error) {
      console.log('error: ', error); // TODO remove
      Bert.alert({
        title: 'Error creating invitation',
        message: error.reason,
        type: 'warning',
        style: 'fixed-bottom',
        icon: 'fa-frown-o',
      });
    },

    after: {
      method(error, result) {
        if (!error) {
          Bert.alert({
            title: 'Invitation sent',
            type: 'success',
            style: 'fixed-bottom',
            icon: 'fa-paper-plane',
          });

          Modal.hide(); // always in a modal, so close it
        }
      },
    },
  },
});
