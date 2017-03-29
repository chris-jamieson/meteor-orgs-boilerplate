import './example-content-view.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating'; // eslint-disable-line import/no-extraneous-dependencies, import/extensions
import { FlowRouter } from 'meteor/kadira:flow-router'; // eslint-disable-line import/no-extraneous-dependencies, import/extensions
import { Bert } from 'meteor/themeteorchef:bert'; // eslint-disable-line import/no-extraneous-dependencies, import/extensions
import { ExampleContent } from '../../../api/example-content/example-content';

Template.exampleContentView.onCreated(function exampleContentCreateOnCreated() {
  const instance = this;

  const exampleContentId = FlowRouter.getParam('exampleContentId');
  instance.subscribe('exampleContent.single', exampleContentId); // subscribe to single example content item

});

Template.exampleContentView.helpers({
  organisationId() {
    return FlowRouter.getParam('organisationId');
  },
  exampleContent() {
    const exampleContentId = FlowRouter.getParam('exampleContentId');
    const exampleContent = ExampleContent.findOne({ _id: exampleContentId });
    return exampleContent;
  },
});

Template.exampleContentView.events({
  'click button[name="js-remove-example-content"]': (event, template) => {
    event.preventDefault();
    const exampleContentId = FlowRouter.getParam('exampleContentId');
    const organisationId = FlowRouter.getParam('organisationId');
    const doc = {
      _id: exampleContentId,
      organisationId,
    };
    Meteor.call('exampleContent.remove', doc, (error, result) => {
      if (error) {
        Bert.alert({
          title: 'Error deleting example content',
          message: error.reason,
          type: 'warning',
          style: 'fixed-bottom',
          icon: 'fa-user-o',
        });
      } else {
        Bert.alert({
          title: 'Example content removed',
          type: 'success',
          style: 'fixed-bottom',
          icon: 'fa-user-o',
        });

        FlowRouter.go('organisations.dashboard', { organisationId });
      }
    });
  }
});
