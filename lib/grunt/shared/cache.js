'use strict';

const grunt = require('grunt');

module.exports = {
  clear
};

function clear(filename) {
  let changes = grunt.config.get('aws_s3_changed');
  if (filename) changes = [filename];
  if (!changes || changes.length === 0)
    return grunt.log.writeln("No changes to what's in S3 storage.");
  grunt.log.writeln(changes.length + ' file changed.  Clearing Cloudflare cache.');
  while (changes.length > 0) {
    let purge = [];
    while (changes.length > 0 && purge.length < 500)
      purge.push('https://cdn.slam.tennis/' + changes.shift());
    grunt.config.set('cloudflare_purge.slam.options.data.files', purge);
    grunt.task.run('cloudflare_purge:slam');
  }
}
