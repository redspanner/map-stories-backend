const mongoose = require('mongoose');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);
const Story = require('../model/model');

describe('Story Model', () => {
  it ('Should return {id, editor, title, tagline} of all stories', async () => {
    const spy = sinon.spy(mongoose.Story, 'select');
    Story.getAllStories();
    spy.should.have.been.calledWith('id editor title tagLine');
  });

  it ('Should return a story object in the correct format', async () => {
    const story = await Story.getAllStories();
    story.should.have.property('_id');
    story.should.have.property('editor');
    story.should.have.property('title');
    story.should.have.property('tagLine');
  });
});
