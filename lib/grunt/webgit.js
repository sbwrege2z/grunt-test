//MWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMW
//MW  GRUNT TASK FUNCTION: WEBGIT
//MWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMW

'use strict';

const grunt = require('grunt');
const multitask = require('./shared/multitask');

module.exports = { exec };

function exec() {
  let { options } = multitask.initialize(this);
  if (!options.tag) grunt.fail.fatal('tag not supplied');
  grunt.config.set('gh-pages.options.tag', options.tag);
  grunt.task.run(['gh-pages:debug']);
}
