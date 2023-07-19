// scripts/serve.js
// development server

const express = require('express');
const path = require('path');
const chalk = require('chalk');
const chokidar = require('chokidar');
const { watch } = require('./build');
const livereload = require('livereload');
const connectLivereload = require('connect-livereload');

const reloadServer = livereload.createServer();
reloadServer.watch(path.resolve(__dirname, '../dist'));
reloadServer.server.once('connection', () => {
    setTimeout(() => {
        reloadServer.refresh('/');
    }, 100);
});

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.resolve(ROOT_DIR, 'dist');
const HTML_FILE = path.resolve(ROOT_DIR, 'index.html');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(DIST_DIR));
app.use(connectLivereload());

app.get('/', (req, res) => {
    res.sendFile(HTML_FILE);
});

app.listen(port, () => {
    console.log(chalk.green(`Server listening on port ${port}`));
});

watch(entry => {
});