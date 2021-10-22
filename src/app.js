const Koa = require("koa"),
  path = require("path"),
  Router = require("koa-router"),
  views = require("koa-views"),
  globalRouter = require('./router'),
  serve = require('koa-static'),
  nunjucks = require('nunjucks');

const app = new Koa();

const router = new Router();

const nunjucksEnvironment = new nunjucks.Environment(
  new nunjucks.FileSystemLoader(path.join(__dirname, "./nunjucks"))
);

const render = views(path.join(__dirname, './nunjucks'), {
  extension: 'html',
  options: {
    nunjucksEnv: nunjucksEnvironment,
  },
  map: {
    html: "nunjucks",
  },
});

app.use(render);

router.use('/', globalRouter.router.routes());

app.use(router.routes());
app.use(serve(path.join(__dirname, '/')));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});