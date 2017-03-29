/**
 * Get the best possible display name for a given user
 * @param  {Object} user A full Meteor.users user object
 * @return {String}      A diplay name for this user
 */
function userDisplayName(user) {
  let display = 'Unidentified user';

  // most basic: email address
  if (user.emails) {
    if (user.emails.length > 0) {
      if (user.emails[0].address) {
        display = user.emails[0].address;
      }
    }
  }

  // next: try for a name
  if (user.profile) {
    if (user.profile.firstName || user.profile.lastName) {
      if (user.profile.firstName && user.profile.lastName) {
        display = `${user.profile.firstName} ${user.profile.lastName}`;
      } else if (user.profile.firstName) {
        display = `${user.profile.firstName}`;
      } else if (user.profile.lastName) {
        display = `${user.profile.lastName}`;
      }
    }
  }

  return display;
}

export { userDisplayName };
