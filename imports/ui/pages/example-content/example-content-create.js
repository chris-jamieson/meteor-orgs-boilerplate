import './example-content-create.html';

import { Template } from 'meteor/templating'; // eslint-disable-line import/no-extraneous-dependencies, import/extensions
import { FlowRouter } from 'meteor/kadira:flow-router'; // eslint-disable-line import/no-extraneous-dependencies, import/extensions
import { ExampleContent } from '../../../api/example-content/example-content';
import './example-content-create-autoform-hooks';

Template.exampleContentCreate.helpers({
  organisationId() {
    return FlowRouter.getParam('organisationId');
  },
  exampleContentCollection() {
    return ExampleContent;
  },
});
