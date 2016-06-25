var parse = require('csv-parse');
var _ = require('lodash');
var Step = require('step');
var debug = require('debug')('chalk:importer:importer');

module.exports = (data, cb) => {
  var config = {
    col: {
      1: 0,
      5: 1,
      9: 2,
      13: 3,
      17: 4,
      21: 5
    },
    start: 2
  };
  Step(
    function() {
      debug("Parsing Data...");
      parse(data, this);
    },
    function(err, table) {
      if(err) throw err;
      debug("Processing Data...");
      cb(null, _.map(config.col, (typeId, col) => {
        return {
          typeId: typeId,
          data: _
            .chain(table)
            .map(col)
            .without("")
            .tail()
            .value()
        };
      }));
    }
  );
};
