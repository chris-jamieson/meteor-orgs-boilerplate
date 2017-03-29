import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { AccountsTemplates } from 'meteor/useraccounts:core';

// Import to load these templates
import '../../ui/layouts/app-body.js';

import '../../ui/pages/app-not-found.js';
import '../../ui/pages/app-unauthorised.js';
import '../../ui/pages/app-home.js';
import '../../ui/pages/app-dashboard.js';

import '../../ui/pages/users/users-profile.js';

import '../../ui/pages/organisations/organisations-select.js';
import '../../ui/pages/organisations/organisations-create.js';
import '../../ui/pages/organisations/organisations-dashboard.js';
import '../../ui/pages/organisations/organisations-settings.js';

import '../../ui/pages/invitations/invitations-accept.js';

import '../../ui/pages/example-content/example-content-create.js';
import '../../ui/pages/example-content/example-content-view.js';
import '../../ui/pages/example-content/example-content-edit.js';

// the App_notFound template is used for unknown routes and missing documents
FlowRouter.notFound = {
  action() {
    BlazeLayout.render('App_body', { main: 'App_notFound' });
  },
};

/**
 * Accounts templates
 */
AccountsTemplates.configureRoute('signIn');
AccountsTemplates.configureRoute('signUp');
AccountsTemplates.configureRoute('forgotPwd');
AccountsTemplates.configureRoute('changePwd');
AccountsTemplates.configureRoute('resetPwd');
AccountsTemplates.configureRoute('enrollAccount');
AccountsTemplates.configureRoute('verifyEmail');

/**
 * Public routes
 */

FlowRouter.route('/', {
  name: 'app.home',
  title: 'Home',
  action() {
    BlazeLayout.render('App_body', { main: 'App_home' });
  },
});

FlowRouter.route('/unauthorised', {
  name: 'app.unauthorised',
  title: 'Unauthorised',
  action() {
    BlazeLayout.render('App_body', { main: 'App_unauthorised' });
  },
});

FlowRouter.route('/invitations/:invitationId/accept', {
  name: 'invitations.accept',
  title: 'Accept invitation',
  action() {
    BlazeLayout.render('App_body', { main: 'invitationsAccept' });
  },
});

/**
 * Private routes
 */

const privateRoutes = FlowRouter.group({
  name: 'private',
  triggersEnter: [
    AccountsTemplates.ensureSignedIn,
  ],
});

privateRoutes.route('/organisations/select', {
  name: 'organisation.select',
  title: 'Select organisation',
  action(params, queryParams) {
    BlazeLayout.render('App_body', { main: 'organisationSelect' });
  },
});

privateRoutes.route('/organisations/create', {
  name: 'organisations.create',
  title: 'Create organisation',
  action(params, queryParams) {
    BlazeLayout.render('App_body', { main: 'organisationsCreate' });
  },
});


privateRoutes.route('/dashboard', {
  name: 'dashboard',
  action() {
    BlazeLayout.render('App_body', { main: 'dashboard' });
  },
});

privateRoutes.route('/profile', {
  name: 'profile',
  action() {
    BlazeLayout.render('App_body', { main: 'usersProfile' });
  },
});

/**
 * Organisation routes
 */

const organisationRoutes = privateRoutes.group({
  prefix: '/o/:organisationId',
  name: 'organisations',
});

organisationRoutes.route('/', {
  name: 'organisations.dashboard',
  title: 'Organisation dashboard',
  action() {
    BlazeLayout.render('App_body', { main: 'organisationsDashboard' });
  },
});

organisationRoutes.route('/settings', {
  name: 'organisations.settings',
  title: 'Organisation settings',
  parent: 'organisations.dashboard',
  action() {
    BlazeLayout.render('App_body', { main: 'organisationsSettings' });
  },
});

/**
 * ExampleContent routes
 */
const exampleContentRoutes = organisationRoutes.group({
  prefix: '/example-content',
  name: 'exampleContent',
});

exampleContentRoutes.route('/', {
  name: 'organisations.exampleContent',
  title: 'Example Content',
  parent: 'organisations.dashboard',
  action() {
    BlazeLayout.render('App_body', { main: 'organisationsExampleContent' });
  },
});

exampleContentRoutes.route('/create', {
  name: 'exampleContent.create',
  title: 'Create example content',
  parent: 'organisations.exampleContent',
  action() {
    BlazeLayout.render('App_body', { main: 'exampleContentCreate' });
  },
});

exampleContentRoutes.route('/:exampleContentId', {
  name: 'exampleContent.view',
  title: 'Example content detail',
  parent: 'organisations.exampleContent',
  action() {
    BlazeLayout.render('App_body', { main: 'exampleContentView' });
  },
});

exampleContentRoutes.route('/:exampleContentId/edit', {
  name: 'exampleContent.edit',
  title: 'Edit example content',
  parent: 'exampleContent.view',
  action() {
    BlazeLayout.render('App_body', { main: 'exampleContentEdit' });
  },
});
