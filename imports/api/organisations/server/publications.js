/* eslint-disable prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { _ } from 'meteor/underscore';
import { Organisations } from '../organisations';

Meteor.publish('organisations.private', function organisationsPrivate() {
  if (!this.userId) {
    return this.ready();
  }

  return Organisations.find({ 'users.id': { $in: [this.userId] } });
});

Meteor.publishComposite('organisations.single', function organisationsSingle(organisationId) {
  return {
    find() {
      if (!this.userId) {
        return this.ready();
      } else {
        let accessPermitted = false;
        if (Roles.userIsInRole(this.userId, ['admin'])) {
          accessPermitted = true;
        } else {
          const organisation = Organisations.findOne({ _id: organisationId });
          const allowedUserIds = _.pluck(organisation.users, 'id');
          if (_.contains(allowedUserIds, this.userId)) {
            accessPermitted = true;
          }
        }

        if (accessPermitted === true) {
          return Organisations.find({ _id: organisationId });
        }
      }
    },
    children: [
      {
        find(organisation) {
          if (organisation.users && organisation.users.length > 0) {
            const organisationUserIds = _.pluck(organisation.users, 'id');
            return Meteor.users.find({
              _id: {
                $in: organisationUserIds,
              },
            }, { fields: {
              'profile.firstName': 1,
              'profile.lastName': 1,
              emails: 1,
              createdAt: 1,
              status: 1,
              portrait: 1,
              'services.twitter.profile_image_url_https': 1,
              'services.facebook.id': 1,
              'services.google.picture': 1,
              'services.github.username': 1,
              'services.instagram.profile_picture': 1,
              'services.linkedin.pictureUrl': 1,
            } });
          } else {
            return this.ready();
          }
        },
      },
    ],
  };
});

Meteor.publish('organisations.all', function organisationsAll() {
  let returnValue;
  if (Roles.userIsInRole(this.userId, ['admin'])) {
    returnValue = Organisations.find({ });
  } else {
    // user not authorized. do not publish
    returnValue = this.stop();
  }
  return returnValue;
});
