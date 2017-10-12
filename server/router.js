const Router = require('koa-router');

const storyController = require('./controller/story.controller');
const editorController = require('./controller/editor.controller');
const router = new Router();

//user actions
router.get('/stories/', storyController.getQuery);
router.get('/stories/:page', storyController.getAllStories);
router.get('/stories/story/:id', storyController.findStory);

//editor actions
router.post('/sign-up', editorController.createEditor);
router.post('/stories', storyController.createStory);
router.put('/stories/story/:id', storyController.editStory);

module.exports = router;
