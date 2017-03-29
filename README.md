# Meteor Orgs Skeleton

This repo is intended to provide some skeleton code for creating a Meteor
application as a "multi-tenant" SaaS application.

To run locally, clone the repo and run `meteor npm install` then `meteor run`.

Start by creating a user account, then create a new organisation.

Invite a new user to the organisation with the "viewer" role, then
  open a new browser to accept the invitation (follow
  the links shown in your terminal but NB you must remove the leading `3D`
  from the URL params `emailAddress` and `token`, e.g. `http://localhost:3000/invitations/8narw6CyAcoAWqKeP/accept?emailAddress=3Dexample@gmail.com&token=3Db0uJ39gnyLSMx0zxptoWG6-Ghim8tYsqqFTWIve8_Dg`
  must become `http://localhost:3000/invitations/8narw6CyAcoAWqKeP/accept?emailAddress=example@gmail.com&token=b0uJ39gnyLSMx0zxptoWG6-Ghim8tYsqqFTWIve8_Dg`).
  Then you can enroll the account (again follow the link in terminal) to set
  the password and log in.

To demonstrate the functionality, add some example content as the admin user,
and view it as the "viewer". You should see the differences in permissions.

Follow the code (NB in particular publications and methods for the `ExampleContent`
  collection, plus various client-side helpers).

## Collections
The basic collections are:

- Organisation: maintains a top-level "account" which has a list of users and
roles. Other collections can reference the organisation ID.
- User: just the default Meteor.users collection
- ContentExample: a simple example of a collection, used to demonstrate how publications and views can interact with the organisation model

## Routing

One new route is added, prompting users to "select an account" when they first
log in. This is to allow a single user (john.smith@example.com) to be attached
to multiple organisations, without having to hack his way around the system by
using multiple email addresses.

Most routes then have the organisation ID prepended with `o/:organisationId`.
This allows content and publications to be handled in a straightforward way
by looking up the organisation ID from the route.

## User invitations

Users can be invited to join an organisation, and this functionality is exposed
via the organisation settings page.
