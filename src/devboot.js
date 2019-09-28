require('./index.css');
require('./currentTransform');

const WebFont = require('webfontloader');

WebFont.load({
  google: {
    families: ['Rubik']
  }
});

const main = require('./main');

module.exports = main.app;
