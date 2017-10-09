const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

const mockStory = {};
const proxyquire = require('proxyquire');

//creates mock model functions to replace original model functions in controller
const Story = proxyquire('../controller/controller',
  { '../model/model' : mockStory}
);

describe('Story should be created', () => {

  const ctx = {request: {body:'foo'}};

  it ('createStory should call model.createStory with the ctx.request.body', async () => {
    const foo = ctx.request.body;
    mockStory.createStory = async (foo) => {
      return;
    };
    const spy = sinon.spy(mockStory, 'createStory');
    const res = await Story.createStory(ctx);
    spy.should.have.been.calledWith('foo');
  });

  it ('createStory should catch errors from model', async () => {
    const foo = ctx.request.body;
    mockStory.createStory = (foo) => {
      throw new Error('error');
    };
    const next = sinon.spy();
    const res = Story.createStory(ctx, next);
    next.should.have.been.called;
  });

});
