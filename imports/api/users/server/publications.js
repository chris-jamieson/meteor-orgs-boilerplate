import { Meteor } from 'meteor/meteor'; 
import { Roles } from 'meteor/alanning:roles'; 

Meteor.publish(null, function publishOwnUser() {
  return Meteor.users.find({
    _id: this.userId,
  }, {
    fields: {
      'profile.firstName': 1,
      'profile.lastName': 1,
      portrait: 1,
      createdAt: 1,
    },
  });
});

Meteor.publish('users.self', function publishUsersPrivate() {
  return Meteor.users.find({
    _id: this.userId,
  }, {
    fields: {
      'profile.firstName': 1,
      'profile.lastName': 1,
      portrait: 1,
      createdAt: 1,
    },
  });
});

Meteor.publish('users.admin.all', function publishUsersAll() {
  let returnValue;
  if (Roles.userIsInRole(this.userId, ['admin'])) {
    returnValue = Meteor.users.find({ }, { fields: {
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
    // user not authorized. do not publish
    returnValue = this.stop();
  }
  return returnValue;
});

Meteor.publish('users.admin.single', function publishUsersSingle(userId) {
  let returnValue;
  if (Roles.userIsInRole(this.userId, ['admin'])) {
    returnValue = Meteor.users.find({ _id: userId }, { fields: {
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
      'preferences.showTransactionLocationField': 1,
    } });
  } else {
    // user not authorized. do not publish
    returnValue = this.stop();
  }
  return returnValue;
});
