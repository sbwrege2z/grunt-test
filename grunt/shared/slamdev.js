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
  completeMerge: { options: {} },
  initializeBranch: { options: {} },
  mergeToDevelopment: {
    options: {
      commands: [
        { operation: 'status', result: { uncommitted: false }, remember: ['currentBranch'] },
        { operation: 'tag' }
      ]
    }
  },
  newBranch: { options: { prefix: null, build: null } },
  pull: { options: {} },
  status: { options: {} },
  showBranches: { options: {} },
  showTags: { options: {} }
});
