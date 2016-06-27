#!/usr/bin/env node

var mongoose = require('mongoose');

var _ = require('lodash');
var Step = require('step');
var fs = require('fs');
var debug = require('debug')('chalk:importer');

var Const = require('./data/const');
var Chalk = require('./Chalk');


debug("Connecting to Database...");
mongoose.connect(Const.database.host);


studentData = null;

Step(
  function() {
    debug("Removing Previous Data...");
    require('./cleaner')(this);
  },
  function(err) {
    if(err) throw err;
    debug("Collecting Student Data...");
    fs.readFile(
      Const.data.path , {
        encoding: "utf-8"
      },
      this
    );
  },
  function(err, data) {
    if(err) throw err;
    require('./importer')(data, this);
  },
  function(err, data) {
    if(err) throw err;
    studentData = data;
    debug("Writing Student Data...");
    var group = this.group();
    _.chain(data)
      .map('data')
      .flatten()
      .uniq()
      .value()
      .forEach((id) => {
        var student = new Chalk.Student({
          _id: id,
          year: (Math.floor(id / 10000) % 10000),
          class: (Math.floor(id / 100) % 100),
          number: (id % 100)
        });
        if(student.year != 2018) {
          debug("Invaild data found: %d", id);
        }
        student.save(group());
      });
  },
  function(err) {
    if(err) throw err;
    debug("Writing Course Data...");
    var group = this.group();
    _(Const.type).forEach((typeId, name) => {
      _(Const.course[typeId]).forEach((courseId, cnt) => {
        if(courseId != -1) {
          var course = new Chalk.Course({
            _id: courseId,
            name: name + (cnt === 0 ? '-adv' : '-std')
          });
          course.save(group());
        }
      });
    });
  },
  function(err) {
    if(err) throw err;
    debug("Collecting Type Data...");
    var __students = {};
    _(studentData).forEach((data) => {
      var students = data.data, typeId = data.typeId;
      _(students).forEach((id) => {
        if(!(id in __students)) {
          __students[id] = [];
        }
        __students[id].push(typeId);
      });
    });
    this(null, __students);
  },
  function(err, students) {
    if(err) throw err;
    debug("Writing Student Course Data...");
    var group = this.group();
    _(students).forEach((student, studentId) => {
      var __courses = [];
      _(Const.course).forEach((courses, typeId) => {
        var courseId;
        if(_.includes(student, typeId)) {
          courseId = courses[0];
        } else {
          courseId = courses[1];
        }
        if(courseId != -1) {
          __courses.push(courseId);
        }
      });
      var cb = group();
      Chalk.Student.findOne({_id: studentId}, (err, student) => {
        if(err) throw err;
        student.courses = __courses;
        student.save(cb);
      });
    });
  },
  function(err, results) {
    if(err) throw err;
    debug("Complete");
    process.exit(0);
  }
);
