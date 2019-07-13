'use strict';

const path = require('path');
const grunt = require('grunt');
const tasks = require('./lib/grunt/tasks');
const multitask = require('./lib/grunt/shared/multitask');

module.exports = function(grunt) {
  require('load-grunt-config')(grunt, {
    init: true,
    configPath: [path.join(process.cwd(), 'grunt'), path.join(process.cwd(), 'grunt/shared')]
  });

  //
  //  tasks
  //

  grunt.registerMultiTask('test', 'Test task', tasks.test);
  grunt.registerMultiTask('simple', 'Log some stuff.', tasks.simple);
  grunt.registerTask('jshint', 'Checking syntax', tasks.jshint);
  grunt.registerMultiTask('prettier', 'Beautify source', tasks.prettier);
  grunt.registerMultiTask('git', 'Git interactions', tasks.git);
  grunt.registerMultiTask('slamdev', 'SLAM Development', tasks.slamdev);

  //
  //  slamdev - git aliases
  //

  grunt.registerTask('checkout', 'check out branch', ['slamdev:checkout']);
  grunt.registerTask('commit', 'Lint, beautify, and commit changes', ['slamdev:commit']);
  grunt.registerTask('completeMerge', 'Complete merge on development branch', [
    'slamdev:completeMerge'
  ]);
  grunt.registerTask('mergeToDevelopment', 'Merge current to development', [
    'slamdev:mergeToDevelopment'
  ]);
  grunt.registerTask('status', 'status', ['slamdev:status']);

  tasks.mapDefaults('test', 'target1');
  tasks.mapDefaults('prettier', 'all');
  tasks.mapDefaults('git', 'status');
  tasks.mapDefaults('slamdev', 'status');
};
