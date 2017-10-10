const Router = require('koa-router');

const storyController = require('./controller/story.controller');
const editorController = require('./controller/editor.controller');
const router = new Router();

//user actions
router.get('/stories/', storyController.getQueriedStory);
router.get('/stories/:page', storyController.getAllStories);
router.get('/stories/:id', storyController.viewStory);

//editor actions
router.post('/sign-up', editorController.createEditor);
router.post('/stories', storyController.createStory);
router.put('/stories/:id', storyController.editStoryMeta);

module.exports = router;
