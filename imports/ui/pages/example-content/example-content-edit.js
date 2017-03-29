import './example-content-edit.html';

import { Template } from 'meteor/templating'; // eslint-disable-line import/no-extraneous-dependencies, import/extensions
import { FlowRouter } from 'meteor/kadira:flow-router'; // eslint-disable-line import/no-extraneous-dependencies, import/extensions
import { ExampleContent } from '../../../api/example-content/example-content';
import './example-content-edit-autoform-hooks';

Template.exampleContentEdit.onCreated(function exampleContentEditOnCreated() {
  const instance = this;

  const exampleContentId = FlowRouter.getParam('exampleContentId');
  instance.subscribe('exampleContent.single', exampleContentId); // subscribe to single example content item

});

Template.exampleContentEdit.helpers({
  exampleContentCollection() {
    return ExampleContent;
  },
  exampleContent() {
    const exampleContentId = FlowRouter.getParam('exampleContentId');
    const exampleContent = ExampleContent.findOne({ _id: exampleContentId });
    return exampleContent;
  },
});
