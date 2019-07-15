//MWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMW
//MW  GRUNT TASK CONFIGURATION: GHPAGES
//MWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMW

let ghpages = (module.exports = {
  options: {
    push: true,
    clone: '../gh-pages/test123',
    repo: 'https://github.com/sbwrege2z/test123.git',
    message: 'auto-generated commit from gh-pages',
    tag: null,
    user: {
      name: 'sbwrege2z',
      email: 'sbwrege2z@gmail.com'
    }
  },
  debug: {
    options: {
      base: 'test/debug',
      branch: 'debug'
    },
    src: ['**/*']
  }
});
