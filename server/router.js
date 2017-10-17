const Router = require('koa-router');

const storiesController = require('./controllers/stories.controller');
const editorController = require('./controllers/editor.controller');
const eventsController = require('./controllers/events.controller');
const router = new Router();

const authMiddleware = async (ctx, next) => {
  let token = ctx.headers.authorization;
  if (!token) return await next();
  else ctx.token = token;
  await next();
};

//user actions
// router.get('/stories/', storiesController.getQuery);
// router.get('/stories/:page', storiesController.getAllStories);
router.get('/stories', storiesController.getAllStories);
router.get('/stories/:page', storiesController.getAllStories);
router.get('/stories/story/:id', storiesController.findStory);

//editor actions
router.post('/sign-up', editorController.signUpEditor);

router.get('/me/stories/:id', editorController.getEditorStories);

router.post('/stories', authMiddleware, storiesController.createStory);
router.put('/stories/story/:id', storiesController.editStory);
router.delete('/stories/story/:id', storiesController.deleteStory);

//event actions
router.post('/stories/story/:id/event', eventsController.addEvent);
router.put('/stories/story/:id/event/:eventId', eventsController.editEvent);
router.delete('/stories/story/:id/event/:eventId', eventsController.deleteEvent);

module.exports = router;
