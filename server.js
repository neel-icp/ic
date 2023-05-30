const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

app.use((req, res, next) => {
  if (path.extname(req.path) === '.js') {
    res.setHeader('Content-Type', 'application/javascript');
  }
  next();
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
