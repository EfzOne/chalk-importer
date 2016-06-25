var Step = require('step');
var debug = require("debug")("chalk:importer:cleaner");
var Chalk = require('./Chalk');

module.exports = (cb) => {
  Step(
    function() {
      debug("Removing Student Data...");
      Chalk.Student.remove({}, this);
    },
    function(err) {
      if(err) throw err;
      debug("Removing Course Data...");
      Chalk.Course.remove({}, this);
    },
    function(err) {
      if(err) throw err;
      debug("Removing Organization Data...");
      Chalk.Organization.remove({}, this);
    },
    function(err) {
      if(err) throw err;
      debug("Removing Teacher Data...");
      Chalk.Teacher.remove({}, this);
    },
    function(err) {
      if(err) throw err;
      cb();
    }
  );
};
