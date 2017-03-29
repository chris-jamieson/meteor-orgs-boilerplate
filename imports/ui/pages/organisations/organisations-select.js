import { Template } from 'meteor/templating'; 
import './organisations-select.html';
import { Organisations } from '../../../api/organisations/organisations';

Template.organisationsSelect.onCreated(function organisationsSelectonCreated() {
  const instance = this;
  instance.subscribe('organisations.private');
});

Template.organisationsSelect.helpers({
  organisations() {
    return Organisations.find();
  },
});
