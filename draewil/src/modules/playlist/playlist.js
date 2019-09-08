const Router = require('koa-router');
const playlistService = require('../../services/playlist');

const router = new Router();

router.get('/', async (ctx) => {
  let { size } = ctx.request.query;
  size = Number.parseInt(size, 10);
  if (!Number.isInteger(size)) {
    ctx.throw(400);
  }
  const items = playlistService.create(size);
  ctx.body = {
    items,
  };
  ctx.status = 200;
});


module.exports = router;
