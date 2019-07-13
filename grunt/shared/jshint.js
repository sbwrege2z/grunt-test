//MWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMW
//MW  GRUNT TASK CONFIGURATION: JSHINT
//MWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMW

let jshint = (module.exports = {
  options: {
    esversion: 8,
    node: true,
    validthis: true,
    sub: true,
    laxbreak: true,
    globals: {
      test: true,
      expect: true
    }
  },
  js: {
    files: [
      {
        src: ['**/*.js', '!node_modules/**', '!**/node_modules/**', '!dist/**', '!stage/**']
      }
    ]
  },
  json: {
    files: [
      {
        src: ['**/*.json', '!node_modules/**', '!**/node_modules/**', '!dist/**', '!stage/**']
      }
    ]
  }
});
