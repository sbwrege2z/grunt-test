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

  grunt.registerMultiTask('test', 'Test task', tasks.test);
  grunt.registerMultiTask('simple', 'Log some stuff.', tasks.simple);
  grunt.registerTask('jshint', 'Checking syntax', tasks.jshint);
  grunt.registerMultiTask('prettier', 'Beautify source', tasks.prettier);
  grunt.registerMultiTask('git', 'Git interactions', tasks.git);

  grunt.registerTask('checkout', 'check out branch', ['git:checkout']);
  grunt.registerTask('commit', 'Lint, beautify, and commit changes', ['git:commit']);

  grunt.registerTask('completeMerge', 'complete merge that experienced conflicts', [
    'git:clean',
    'jshint',
    'newer:prettier:all',
    'git:commit',
    'git:completeMerge'
  ]);

  grunt.registerTask(
    'mergeToDevelopment',
    'Merge current branch to development and start a new branch',
    ['git:clean', 'jshint', 'newer:prettier:all', 'git:commit', 'git:mergeToDevelopment']
  );

  tasks.mapDefaults('test', 'target1');
  tasks.mapDefaults('prettier', 'all');
  tasks.mapDefaults('git', 'status');
};
