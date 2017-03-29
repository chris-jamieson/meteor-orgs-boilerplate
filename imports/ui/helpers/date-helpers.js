import { Template } from 'meteor/templating';
import { getDateTimeString } from '../../modules/date-format';

Template.registerHelper('dateTimeFormat', date => getDateTimeString(date));
