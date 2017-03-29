import { Template } from 'meteor/templating'; 
import './organisations-create.html';
import { Organisations } from '../../../api/organisations/organisations';
import './organisations-create-autoform-hooks';

Template.organisationsCreate.helpers({
  organisationsCollection() {
    return Organisations;
  },
});
