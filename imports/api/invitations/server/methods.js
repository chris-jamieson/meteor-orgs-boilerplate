import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Random } from 'meteor/random';
import { moment } from 'meteor/momentjs:moment';
import { Email } from 'meteor/email';
import { Accounts } from 'meteor/accounts-base';
import SimpleSchema from 'simpl-schema';
import { _ } from 'underscore';
import { Organisations } from '../../organisations/organisations';
import { Invitations } from '../../invitations/invitations';
import { userDisplayName } from '../../../helpers/user-helpers';

const insert = new ValidatedMethod({
  name: 'invitations.insert',
  validate: new SimpleSchema({
    emailAddress: { type: String },
    firstName: { type: String, optional: true },
    lastName: { type: String, optional: true },
    organisationId: { type: String },
    organisationRole: { type: String },
  }).validator(),
  run(fields) {
    const invitation = fields;
    const creatingUserId = this.userId;
    if (!creatingUserId) {
      throw new Meteor.Error('invitations.insert.accessDenied',
        'Cannot create invitations unless logged in');
    }

    const organisation = Organisations.findOne({ _id: invitation.organisationId });
    if (organisation) {
      const possibleOrgRoles = ['owner', 'administrator', 'manager', 'viewer'];
      if (_.contains(possibleOrgRoles, invitation.organisationRole)) {
        let allowedOrgRoles = [];

        // only owners can invite owners
        if (invitation.organisationRole === 'owner') {
          allowedOrgRoles = ['owner'];
        } else {
          // administrators can invite any other role
          allowedOrgRoles = ['owner', 'administrator'];
        }

        if (!organisation.userHasRoleInOrganisation(creatingUserId, allowedOrgRoles)) {
          throw new Meteor.Error('invitations.insert.insufficientOrganisationRole',
            'This user does not have the necessary role within the organisation.');
        }
      } else {
        throw new Meteor.Error('invitations.insert.invalidRole',
          'The requested organisation role was invalid.');
      }
    } else {
      throw new Meteor.Error('invitations.insert.organisationNotFound',
        'The organisation ID provided was not found.');
    }

    // prevent users from being invited if they are already a member of the organisation
    const existingUser = Meteor.users.findOne({ 'emails.address': invitation.emailAddress });
    if (existingUser) {
      const userInOrganisation = organisation.userIsInOrganisation(existingUser._id);
      if (userInOrganisation) {
        throw new Meteor.Error('invitations.insert.userAlreadyOrganisationMember',
          'A user with this email address already exists, and is a member of this organisation.');
      }
    }

    invitation.createdBy = creatingUserId;
    invitation.expiresAt = moment().add(30, 'days').toDate();
    invitation.token = Random.secret();
    invitation.isUsed = false;

    return Invitations.insert(invitation);
  },
});

const sendInviteEmail = new ValidatedMethod({
  name: 'invitations.sendInviteEmail',
  validate: new SimpleSchema({
    invitationId: { type: String },
  }).validator(),
  run(fields) {
    const sendingUserId = this.userId;
    if (!sendingUserId) {
      throw new Meteor.Error('invitations.sendInviteEmail.accessDenied',
        'Cannot send invitations unless logged in');
    }

    const invitation = Invitations.findOne({ _id: fields.invitationId });
    const sendingUser = Meteor.users.findOne({ _id: sendingUserId });
    const organisation = Organisations.findOne({ _id: invitation.organisationId });

    if (!invitation) {
      throw new Meteor.Error('invitations.sendInviteEmail.invitationNotFound',
        'The specified invitation was not found');
    }

    if (invitation.isUsed === true) {
      throw new Meteor.Error('invitations.sendInviteEmail.invitationUsed',
        'The specified invitation has already been used');
    }

    if (invitation.isExpired() === true) {
      throw new Meteor.Error('invitations.sendInviteEmail.invitationExpired',
        'The specified invitation has expired');
    }

    const sendingUserDisplayName = userDisplayName(sendingUser);
    const subject = `${sendingUserDisplayName} has invited you to the ${organisation.name} organisation`; // TODO consider adding app name
    const path = `invitations/${invitation._id}/accept?emailAddress=${invitation.emailAddress}&token=${invitation.token}`;
    const invitationUrl = Meteor.absoluteUrl(path, { secure: true });

    let recipientName = 'there';
    if (invitation.firstName || invitation.lastName) {
      recipientName = `${invitation.firstName} ${invitation.lastName}`;
    }

    const bodyHtml = `<p>Hi ${recipientName},</p>
      <p>You have been invited to join the ${organisation.name} organisation by ${sendingUserDisplayName}.</p>
      <p>To accept this invitation, please <a href="${invitationUrl}">click this link</a> or
      copy and paste it into your browser: ${invitationUrl}</p>.
    <p>If you believe you have received this email in error, you can simply ignore it.</p>`;
    this.unblock();
    Email.send({
      to: invitation.emailAddress,
      from: 'invitations-no-reply@example.com', // TODO replace with app domain
      subject,
      html: bodyHtml,
    });
  },
});

const load = new ValidatedMethod({
  name: 'invitations.load',
  validate: new SimpleSchema({
    invitationId: { type: String },
    emailAddress: { type: String },
    token: { type: String },
  }).validator(),
  run(fields) {
    const invitation = Invitations.findOne({ _id: fields.invitationId });
    const loggedInUserId = this.userId;

    if (!invitation) {
      throw new Meteor.Error('invitations.load.invitationNotFound',
        'The specified invitation was not found');
    }

    if (loggedInUserId) {
      const loggedInUser = Meteor.users.findOne({ _id: loggedInUserId });
      const loggedInUserEmails = _.map(loggedInUser.emails, emailObject => emailObject.address);
      if (!_.contains(loggedInUserEmails, invitation.emailAddress)) {
        throw new Meteor.Error('invitations.load.loggedInUserMismatchEmailAddress',
          'The currently logged in user\'s email address does not match the invitation.');
      }
    }

    if (invitation.emailAddress !== fields.emailAddress) {
      throw new Meteor.Error('invitations.load.emailAddressDoesNotMatch',
        'A problem occurred loading this invitation: access denied.');
    }

    if (invitation.token !== fields.token) {
      throw new Meteor.Error('invitations.load.tokenDoesNotMatch',
        'A problem occurred loading this invitation: access denied.');
    }

    if (invitation.isUsed === true) {
      throw new Meteor.Error('invitations.load.invitationUsed',
        'The specified invitation has already been used.');
    }

    if (invitation.isExpired() === true) {
      throw new Meteor.Error('invitations.load.invitationExpired',
        'The specified invitation has expired.');
    }

    return invitation;
  },
});

const accept = new ValidatedMethod({
  name: 'invitations.accept',
  validate: new SimpleSchema({
    invitationId: { type: String },
    emailAddress: { type: String },
    token: { type: String },
  }).validator(),
  run(fields) {
    const response = {
      message: '',
      redirectPath: '',
      anchorText: '',
      error: false,
    };
    const loggedInUserId = this.userId;
    const invitation = Invitations.findOne({ _id: fields.invitationId });

    if (!invitation) {
      throw new Meteor.Error('invitations.load.invitationNotFound',
        'The specified invitation was not found');
    }

    if (loggedInUserId) {
      const loggedInUser = Meteor.users.findOne({ _id: loggedInUserId });
      const loggedInUserEmails = _.map(loggedInUser.emails, emailObject => emailObject.address);
      if (!_.contains(loggedInUserEmails, invitation.emailAddress)) {
        throw new Meteor.Error('invitations.load.loggedInUserMismatchEmailAddress',
          'The currently logged in user\'s email address does not match the invitation.');
      }
    }

    if (invitation.emailAddress !== fields.emailAddress) {
      throw new Meteor.Error('invitations.load.emailAddressDoesNotMatch',
        'A problem occurred loading this invitation: access denied.');
    }

    if (invitation.token !== fields.token) {
      throw new Meteor.Error('invitations.load.tokenDoesNotMatch',
        'A problem occurred loading this invitation: access denied.');
    }

    if (invitation.isUsed === true) {
      throw new Meteor.Error('invitations.load.invitationUsed',
        'The specified invitation has already been used.');
    }

    if (invitation.isExpired() === true) {
      throw new Meteor.Error('invitations.load.invitationExpired',
        'The specified invitation has expired.');
    }

    // load the organisation
    const organisation = Organisations.findOne({ _id: invitation.organisationId });

    // check if user exists already with matching email
    const existingUser = Meteor.users.findOne({ 'emails.address': invitation.emailAddress });

    if (existingUser) {
      // add to org. Prompt to log in if anon, or take to select account page if logged in
      const userInOrganisation = organisation.userIsInOrganisation(existingUser._id);

      if (userInOrganisation) {
        response.error = true;
        response.message = 'You are already a member of this organisation.';
        if (loggedInUserId) {
          // user is logged in
          if (existingUser._id === this.userId) {
            response.message += ' Please select an account.';
            response.anchorText = 'Go to organisation selection page';
            response.redirectPath = '/organisations/select';
          } else {
            response.message += ' You are currently logged in as a different user.';
            response.anchorText = 'Go to organisation selection page';
            response.redirectPath = '/organisations/select';
          }
        } else {
          response.message += ' Please log in.';
          response.anchorText = 'Go to login page';
          response.redirectPath = '/sign-in';
        }
      } else {
        // Add user to the appropriate organisation, with role if set
        const userInOrg = { id: existingUser._id };
        response.message += 'You have been added to this organisation';
        if (invitation.organisationRole) {
          userInOrg.role = invitation.organisationRole;
          response.message += ` with the role ${invitation.organisationRole}`;
        }
        response.message += '. ';
        Organisations.update({ _id: invitation.organisationId }, { $addToSet: { users: userInOrg } });
        if (loggedInUserId) {
          // user is logged in
          response.message += 'Please select an account.';
          response.anchorText = 'Go to organisation selection page';
          response.redirectPath = '/organisations/select';
        } else {
          response.message += ' Please log in.';
          response.anchorText = 'Go to login page';
          response.redirectPath = '/sign-in';
        }
      }
    } else {
      // if no user exists, create one, log in and prompt to set password
      const newUser = {
        email: invitation.emailAddress,
        profile: {
          firstName: invitation.firstName,
          lastName: invitation.lastName,
        },
      };

      const newUserId = Accounts.createUser(newUser);
      Accounts.sendEnrollmentEmail(newUserId);

      response.message += 'A new user account has been created for you. ';
      response.message += 'Please check your email for further instructions. ';

      // Add user to the appropriate organisation, with role if set
      const userInOrg = { id: newUserId };
      response.message += 'You have been added to this organisation';
      if (invitation.organisationRole) {
        userInOrg.role = invitation.organisationRole;
        response.message += ` with the role ${invitation.organisationRole}`;
      }
      response.message += '. ';
      Organisations.update({ _id: invitation.organisationId }, { $addToSet: { users: userInOrg } });

      // TODO consider a custom "waiting for you to set your password" page for redirection
      response.anchorText = 'Go to login page';
      response.redirectPath = '/sign-in';
    }

    // mark invitation as used
    Invitations.update({ _id: invitation._id }, { $set: { isUsed: true } });

    return (null, response);
  },

    // TODO consider notifying sender by email (user has accepted your invitation) - perhaps in a collection hook?
});

export { insert, sendInviteEmail, load, accept };
