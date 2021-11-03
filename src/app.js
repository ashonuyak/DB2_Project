const Koa = require("koa"),
  path = require("path"),
  Router = require("koa-router"),
  views = require("koa-views"),
  config = require("config"),
  globalRouter = require("./router"),
  serve = require("koa-static"),
  nunjucks = require("nunjucks"),
  bodyParser = require("koa-bodyparser");

const app = new Koa();

const router = new Router();

const nunjucksEnvironment = new nunjucks.Environment(
  new nunjucks.FileSystemLoader(path.join(__dirname, "./nunjucks"))
);

const render = views(path.join(__dirname, "./nunjucks"), {
  extension: "html",
  options: {
    nunjucksEnv: nunjucksEnvironment,
  },
  map: {
    html: "nunjucks",
  },
});

app.use(render);

app.use(bodyParser());

// app.use(async (ctx, next) => {
//   try {
//     await next();
//   } catch (err) {
//     if (err.isJoi) {
//       ctx.throw(400, err.details[0].message);
//     }
//     ctx.throw(400, "Something went wrong");
//   }
// });

router.use("", globalRouter.router.routes());

app.use(router.routes());
app.use(serve(path.join(__dirname, "/")));

const port = config.get("server.port");

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
