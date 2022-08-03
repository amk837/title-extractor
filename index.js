import express from 'express';
import htmlExpress from 'html-express-js';
import { resolve } from 'path';
import { port } from './config.js';
import tasks from './routes/tasks.js';
const app = express();
const __dirname = resolve();
app.engine(
  'js',
  htmlExpress({
    includesDir: 'includes', // where all includes reside
  })
);
app.set('view engine', 'js');
app.set('views', `${__dirname}/views`);

app.use('/', tasks);
app.use('**', (req, res, next) => {
  res.send('<h1>404 Page Not Found</h1>');
});

app.listen(port, () => {
  console.log(`server running on localhost: ${port}`);
});
