const test = require('ava');
const supertest = require('supertest');
const storage = require('../src/storage');
const createApp = require('../src/app');

let request = {};
let server = {};


test.before(async () => {
  await storage.init();
  server = createApp().listen(8888);
});
test.after(() => { server.close(); });

test.beforeEach(async () => {
  request = supertest(server);
});

test('playlist:ok', async (t) => {
  const res = await request
    .get('/api/v1/playlist?size=1');
  t.is(res.status, 200);
});

test('playlist:invalid_size', async (t) => {
  const res = await request
    .get('/api/v1/playlist?size=a');
  t.is(res.status, 400);
});

test('playlist:songs_count_25', async (t) => {
  const count = 25;
  const res = await request
    .get(`/api/v1/playlist?size=${count}`);
  t.is(res.status, 200);
  t.is(res.body.items.length, count);
});

test('playlist:songs_count_1000', async (t) => {
  const count = 1000;
  const res = await request
    .get(`/api/v1/playlist?size=${count}`);
  t.is(res.status, 200);
  t.is(res.body.items.length, count);
});
