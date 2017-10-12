const chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.should();

const proxyquire = require('proxyquire');
const mockStoryModel = {};

// creates mock model functions to replace original model functions in controller
const StoriesController = proxyquire('../controller/story.controller',
  { '../model/story.model' : mockStoryModel}
);

const mocks = require('./mocks');

describe('Stories Collection', () => {
  // it('should return editor, tagline and title for each story', async () => {
  // //Need to rewrite to put logic in controller instead of model
  //   mockStoryModel.getAllStories = sinon.stub().returns(mockStories);
  //   const ctx = {};
  //   await StoriesController.getAllStories(ctx);
  //   Array.isArray(ctx.body).should.be.true;
  //   ctx.body[0].should.have.property('editor');
  //   ctx.body[0].should.have.property('tagline');
  //   ctx.body[0].should.have.property('title');
  //   ctx.body[0].should.not.have.property('__v');
  // });

  it('should return no more stories than the maximum defined by pagination settings', async () => {
    const mockStories = Array(60).fill(0);
    for (let i = 0; i < mockStories.length; i++) {
      mockStories[i] = i;
    }
    mockStoryModel.getAllStories = sinon.stub().returns(mockStories);
    const ctx = {
      params: {page: 1},
      body: null,
    };
    await StoriesController.getAllStories(ctx);
    ctx.body.should.have.lengthOf(20);
  });

  it('should return only records that match any query terms provided', async () => {
    //rewrite function so that the controller.getAllStories does the regexp
    const mockStories = mocks.mockStories;
    mockStoryModel.getAllStories = sinon.stub().returns(mockStories);
    const ctx = {
      request: {
        query: 'hawk',
      },
      body: null,
    };
    // await getQuery(ctx);
    // ctx.body[0].editor.name.should.be('Stephen Hawking');
    // ctx.body[0].title.should.be('Black Hawk Down');
    // ctx.body.should.be.ofLength(2);
  });

  it('should return empty array if no records match the query');
  it('should return 400 if pagination is not valid');
  it('should be able to view own stories');
});


describe('Story', () => {
  it('should not be created if mandatory data not provided', async () => {
    const ctx = {
      request: {
        body: {
          title: '',
          tagLine: '',
          map: '',
          duration: '',
        },
      }
    };
    await StoriesController.createStory(ctx)
    ctx.body.message.should.equal('Your story needs a valid title!')
  });

  it('should not publish a story if no events in it', async () => {
    const ctx = {
      request: {

      },
      params: {
        id: 123,
      }
    }
  });

  it('should remove story from DB when deleted');
  it('viewStory should return a single story');
  it('should update story when edited');
  it('should create a new event');
  it('if events are deleted the story events array should reflect this');
});

describe('Editor', () => {
  it('should be able to log in with Facebook');
  it('should pull image, name and email from Facebook');
  // it('should be able to delete profile');
});


describe('Events', () => {
  it('should reflect changes to its events');
  it('should have a title');
  it('should have a startTime');
  it('should have unique startTime');
  it('should update attachments');
  it('should remove event from DB when deleted');
});

describe('Attachments', () => {
  it('should validate text format');
  it('should validate tweet format');
  it('should validate image format');
  it('should validate video format');
  it('should validate audio format');
  it('should validate link format');
});
