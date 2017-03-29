import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Users } from '../users/users';

SimpleSchema.extendOptions(['autoform']);

// eslint-disable-next-line import/prefer-default-export
export const ExampleContent = new Mongo.Collection('exampleContent');

ExampleContent.schema = new SimpleSchema({
  text: {
    type: String,
    label: 'Text',
    autoform: {
      placeholder: 'This is just some example text',
    },
  },
  organisationId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: 'Organisation',
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
    optional: true,
  },
  createdBy: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
});

ExampleContent.insertSchema = ExampleContent.schema.pick(
  'organisationId',
  'text',
);

ExampleContent.updateSchema = ExampleContent.schema.pick(
  'organisationId',
  'text',
).extend({
  _id: { type: String, regEx: SimpleSchema.RegEx.Id },
});

ExampleContent.publicFields = {
  text: true,
  createdAt: true,
  organisationId: true,
  _id: true,
};

ExampleContent.attachSchema(ExampleContent.schema);

ExampleContent.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});
