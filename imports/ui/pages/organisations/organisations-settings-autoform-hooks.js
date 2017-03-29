import { AutoForm } from 'meteor/aldeed:autoform'; 
import { Bert } from 'meteor/themeteorchef:bert'; 

AutoForm.hooks({
  editOrganisationForm: {
    onError(formType, error) {
      Bert.alert({
        title: 'Error updating organisation',
        message: error.message,
        type: 'warning',
        style: 'fixed-bottom',
        icon: 'fa-check',
      });
    },

    after: {
      'method-update': function methodUpdate(error, result) {
        if (!error) {
          Bert.alert({
            title: 'Organisation updated',
            type: 'success',
            style: 'fixed-bottom',
            icon: 'fa-building-o',
          });
        }
      },
    },
  },
});
