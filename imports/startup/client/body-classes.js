import { Meteor } from 'meteor/meteor';
import { Blaze } from 'meteor/blaze';

if (Meteor.isCordova) {
  Blaze.addBodyClass(function addBodyClass() {
    return 'is-cordova';
  });
}
