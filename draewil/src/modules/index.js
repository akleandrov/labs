const Router = require('koa-router');

const playlist = require('./playlist');

const router = new Router({
  prefix: '/api/v1',
});

router.use('/playlist', playlist.routes());


module.exports = router;
