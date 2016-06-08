#!/usr/bin/env node

var mongoose = require('mongoose');
var parse = require('csv-parse/lib/sync');
var fs = require('fs');
var _ = require("lodash");
var debug = require("debug")("chalk:importer");
var Step = require("step");

var Const = require("./const");
var Chalk = require("chalk-schema")(mongoose);

debug("Reading Data...");

var config = {
  row: {
    1: "physics",
    5: "chemistry",
    9: "geography",
    13: "physiology",
    17: "history",
    21: "politics"
  },
  col: {
    start: 2
  },
  "path": __dirname + "/data/data.csv"
};

var data = parse(fs.readFileSync(config.path, {
  encoding: "utf-8"
}));

debug("Connecting to Database...");
mongoose.connect('mongodb://localhost/test');

Step(
  function() {
    debug("Removing Previous Data...");
    Chalk.Student.remove({}, this);
  },
  function(err) {
    if(err) return console.error(err);
    Chalk.Type.remove({}, this);
  },
  function(err) {
    if(err) return console.error(err);
    Chalk.Lesson.remove({}, this);
  },
  function(err) {
    if(err) return console.error(err);
    var group = this.group();
    debug("Writing Student Data...");
    _(_.map(config.row, (cls, col) => {
      return _.chain(data).map(col).without("").tail().value();
    })).flatten().uniq().value().forEach((id) => {
      var student = new Chalk.Student({
        id: id,
        year: (Math.floor(id / 10000) % 10000),
        class: (Math.floor(id / 100) % 100),
        number: (id % 100)
      });
      if(student.year == 2018) {
        student.save(group());
      } else {
        debug("Invaild data found: %d", id);
      }
    });
  },
  function(err) {
    if(err) return console.error(err);
    var students = {};
    debug("Collecting Type Data...");
    _(config.row).forEach((cls, col) => {
      var __type_id = Const.type[cls];
      _.chain(data).map(col).without("").tail().value().forEach((id) => {
        if(!(id in students)) {
          students[id] = [];
        }
        students[id].push(__type_id);
      });
    });
    this(null, students);
  },
  function(err, result) {
    if(err) return console.error(err);
    debug("Writing Type Data...");
    var group = this.group();
    _(result).forEach((types, id) => {
      var type = new Chalk.Type({
        id: id,
        types: types
      });
      type.save(group());
    });
  },
  function(err, students) {
    if(err) return console.error(err);
    debug("Writing Lesson Data...");
    var group = this.group();
    _(students).forEach((student) => {
      _(Const.lesson).forEach((lessons, typeId) => {
        var lesson;
        if(typeId in student.types) {
          lesson = new Chalk.Lesson({
            id: student.id,
            lessonId: lessons[0]
          });
        } else {
          lesson = new Chalk.Lesson({
            id: student.id,
            lessonId: lessons[1]
          });
        }
        if(lesson.lesson != -1) {
          lesson.save(group());
        }
      });

    });
  },
  function(err, results) {
    if(err) return console.error(err);
    debug("Complete");
    process.exit(0);
  }
);
