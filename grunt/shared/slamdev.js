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
  newBranch: { options: { prefix: null, build: null } },
  pull: { options: {} },
  status: { options: {} },
  showBranches: { options: {} },
  showTags: { options: {} }
});
