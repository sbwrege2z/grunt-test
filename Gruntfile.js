'use strict';

module.exports = function(grunt) {
  require('load-grunt-config')(grunt);

  grunt.registerMultiTask('test', 'Test task', function() {
    grunt.log.writeln('taskParam = ' + grunt.config('test.options.taskParam'));
    grunt.log.writeln('targetParam = ' + grunt.config('test.default.options.targetParam'));
    grunt.log.writeln('cliParam = ' + grunt.option('cliParam'));
  });
};
