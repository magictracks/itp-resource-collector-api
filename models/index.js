var mongoose = require('mongoose');
mongoose.set('debug', true);
require('mongoose-type-url');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/itp-tagged-resources', {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE
});

module.exports.Resource = require("./resource");