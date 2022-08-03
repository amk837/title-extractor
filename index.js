const express = require('express');
const { port } = require('./config');
const tasks = require('./routes/tasks');

const app = express();

app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);
app.use('/', tasks);
app.use('*', (req, res) => {
  res.send('<h1>404 Page Not Found</h1>');
});

app.listen(port, () => {
  console.log(`server running on localhost: ${port}`);
});
