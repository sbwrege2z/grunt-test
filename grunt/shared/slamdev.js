//MWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMW
//MW  GRUNT TASK CONFIGURATION: SLAMSHARED
//MWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMW

let slamdev = (module.exports = {
  options: {
    fatal: true,
    silent: false,
    verbose: false
  },
  commit: { options: {} },
  status: { options: {} },
  showBranches: { options: {} },
  showTags: { options: {} }
});
