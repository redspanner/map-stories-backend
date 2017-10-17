const mongoose = require('mongoose');
const Story = require('../model/story.model');
const Event = require('../model/event.model').Event;
const Attachment = require('../model/event.model').Attachment;

require('../db')('mapstory-backend-test');

//Adds event to events array within story object
const addEvent = async (ctx, next) => {
  try {
    if (ctx.request.body.title) {
      const target = await Story.findOne({_id: ctx.params.id});
      if (ctx.request.body.attachments.length !== 0) {
        var attachmentsArr = ctx.request.body.attachments.slice();
        attachmentsArr = await Promise.all(attachmentsArr.map(async attachment => {
          let attachmentData;
          if (attachment.type === 'Link') {
            attachmentData = {
              type: attachment.type,
              url: attachment.url,
              urlImg: attachment.urlImg,
              title: attachment.title,
            };
          } else if (attachment.type === 'Text') {
            attachmentData = {
              type: attachment.type,
              text: attachment.text,
            };
          } else {
            attachmentData = {
              type: attachment.type,
              url: attachment.url,
            };
          }
          return await Attachment.create(attachmentData);
        }));
      }
      const eventData = {
        title: ctx.request.body.title,
        startTime: ctx.request.body.startTime,
        mapLocation: ctx.request.body.mapLocation,
        dateAndTime: ctx.request.body.dateAndTime,
        attachments: attachmentsArr,
      };
      const createdEvent = await Event.create(eventData);
      target.events.push(createdEvent);
      target.save();
      ctx.status = 201;
      ctx.body = createdEvent;
    } else {
      throw 'No title provided!';
    }
  }
  catch (error) {
    console.error(error);
    throw ('Could not create event!');
  }
};

//Updates existing events
const editEvent = async (ctx, next) => {

  try {
    const targetStory = await Story.findOne({'_id': ctx.params.id}).populate('events');
    const edits = ctx.request.body;

    const updatedProps = {};

    if (edits.title) updatedProps.title = edits.title;
    if (edits.startTime) updatedProps.map = edits.startTime;
    if (edits.mapLocation) updatedProps.duration = edits.mapLocation;
    if (edits.dateAndTime) updatedProps.tagLine = edits.dateAndTime;
    if (edits.attachments) updatedProps.published = edits.attachments;

    const eventId = ctx.params.eventId;
    await Event.findOneAndUpdate({'_id': eventId}, {$set: updatedProps});
    const updatedEvent = await Event.findOne({'_id': eventId});
    ctx.body = updatedEvent;
  } catch (error) {
    throw (401, error);
  }
};

//Deletes existing events
const deleteEvent = async (ctx, next) => {
  try {
    const targetStory = await Story.findOne({'_id': ctx.params.id})
                                   .populate('events');
    const targetEvent = targetStory.events;
    for (var i = 0; i < targetEvent.length; i++) {
      if (targetEvent[i]['_id'] == ctx.params.eventId) {
        targetEvent.splice(i, 1);
      }
    }
    targetStory.save();
    ctx.status = 200;
  } catch (error) {
    throw (401, 'Could not edit event!');
  }
};

module.exports = {
  addEvent,
  editEvent,
  deleteEvent
};
