'use strict';

const express = require('express');
const fs = require('fs');
const path = require('path');
require('dotenv-flow').config();

const app = express();

const selfServer = process.env.SELF_SERVER
const port = process.env.LISTEN_PORT


/**
 * 返回 config 的 package.json
 */
app.get('/jianghu-init-config/latest', (req, res) => {
  res.send(JSON.parse(fs.readFileSync('../jianghu-init-config/package.json', 'utf8')))
})

/**
 * 返回 init 的 package.json
 */
app.get('/jianghu-init/latest', (req, res) => {
  res.send(JSON.parse(fs.readFileSync('../jianghu-init/package.json', 'utf8')))
})

/**
 * 返回参考 https://registry.npm.taobao.org/egg-boilerplate-simple/latest
 */
app.get('/:pkg/latest', (req, res) => {
  if (req.params.pkg.startsWith('jianghu-boilerplate-')) {
    res.send({
      dist: {
        tarball: `${process.env.SELF_SERVER}/dist/${req.params.pkg}.tgz`
      }
    });
  } else {
    res.redirect(`https://registry.npmjs.org/${req.params.pkg}/latest`)
  }
})

app.get('/dist/:file', (req, res) => {
  if (req.params.file.startsWith('jianghu-boilerplate-')) {
    res.sendFile(path.join(__dirname, `dist/${req.params.file}`));
  } else {
    res.status(404).send('?');
  }
})

app.get('*', function(req, res){
  res.status(404).send('?');
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});





