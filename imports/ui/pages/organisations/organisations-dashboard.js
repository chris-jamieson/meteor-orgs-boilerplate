import './organisations-dashboard.html';

import { Template } from 'meteor/templating';
import { Organisations } from '../../../api/organisations/organisations';
import { ExampleContent } from '../../../api/example-content/example-content';

Template.organisationsDashboard.onCreated(function organisationsDashboardOnCreated() {
  const instance = this;

  const organisationId = FlowRouter.getParam('organisationId'); // get the org ID from URL via FlowRouter
  instance.subscribe('organisations.single', organisationId);
  instance.subscribe('exampleContent.inOrganisation', organisationId); // subscribe to example content in this org
});

Template.organisationsDashboard.helpers({
  organisation() {
    const organisationId = FlowRouter.getParam('organisationId');
    const organisation = Organisations.findOne({ _id: organisationId });
    return organisation;
  },
  exampleContent() {
    return ExampleContent.find();
  },
});
