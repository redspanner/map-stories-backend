const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('koa-cors');
const Console = console;

const app = new Koa();
const router = require('./router');
require('./db')('mapstory-backend');

const corsOptions = {origin: 'http://localhost:3000'};

app
  .use(cors(corsOptions))
  .use(async (cxt, next) => {
    try {
      await next();
    } catch (e) {
      console.error(e);
      ctx.status = 500;
      if (e.message) {
        ctx.body = {
          errors: [e.message]
        };
      }
    }
  })
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(4000, ()=> {
  Console.log('koa app listening on port 4000');
});
