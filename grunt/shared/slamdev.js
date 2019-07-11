//MWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMW
//MW  GRUNT TASK CONFIGURATION: SLAMSHARED
//MWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMW

let slamdev = (module.exports = {
  options: {
    fatal: true,
    silent: false,
    verbose: false
  },
  checkout: { options: { branch: null } },
  commit: { options: {} },
  status: { options: {} },
  showBranches: { options: {} },
  showTags: { options: {} }
});
