//MWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMW
//MW  GRUNT TASK CONFIGURATION: GHPAGES
//MWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMW

let ghpages = (module.exports = {
  options: {
    //push: true,
    //clone: '/home/evol/working/stats/test123',
    repo: 'https://github.com/sbwrege2z/test123.git',
    message: 'auto-generated commit from gh-pages',
    tag: 'bld190714',
    user: {
      name: 'sbwrege2z',
      email: 'sbwrege2z@gmail.com'
    },
    //base: 'test/debug',
    base: 'test',
    branch: 'test123'
  },
  debug: {
    src: ['**/*']
  }
});
