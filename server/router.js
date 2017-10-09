const Router = require('koa-router');

const controller = require('./controller/controller');
const router = new Router();

//user actions
router.get('/stories', controller.getAllStories);
router.get('/stories/:id', controller.viewStory);

//editor actions
router.post('/stories', controller.createStory);
router.put('/stories/:id', controller.editStoryMeta);

module.exports = router;
