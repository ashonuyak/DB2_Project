const Koa = require("koa");
const config = require('config')
const path = require("path");
const Router = require("koa-router");
const views = require("koa-views");
const serve = require("koa-static");
const bodyParser = require("koa-bodyparser");
const cors = require("@koa/cors");
const passport = require("./libs/passport/koaPassport");

passport.initialize();

const globalRouter = require("./user/router");

const app = new Koa();

app.use(cors());

app.use(bodyParser());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.log(err);
    if (err.isJoi) {
      ctx.throw(400, err.details[0].message);
    }
    ctx.throw(400, err.message);
    if (err.isPassport) {
      ctx.throw(401, err.message);
    }

    ctx.throw(err.status || 500, err.message);
  }
});

const router = new Router();

router.use("", globalRouter.router.routes());

app.use(router.routes());
app.use(serve(path.join(__dirname, "/")));

const port = config.get("server.port");

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
