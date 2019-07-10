//MWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMW
//MW  GRUNT TASK CONFIGURATION: GIT
//MWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMW

let git = (module.exports = {
  options: {
    fatal: true,
    silent: false,
    verbose: false
  },
  status: {
    options: {}
  },
  clean: {
    options: {}
  },
  commitInternal: {
    options: {}
  },
  commit: {
    options: {}
  },
  showTags: {
    options: {}
  },
  tag: {
    options: {}
  },
  showBranches: {
    options: {}
  },
  branch: {
    options: {}
  },
  newBranch: {
    options: {
      prefix: null,
      build: null
    }
  },
  checkout: {
    options: {
      branch: null
    }
  },
  pull: {
    options: {}
  },
  merge: {
    options: {}
  },
  completeMerge: {
    options: {}
  },
  debug: {
    options: {}
  },
  tagsAndBranches: {
    options: {
      commands: [
        {
          operation: 'tag',
          parameters: {
            silent: true
          }
        },
        { operation: 'branch' }
      ]
    }
  },
  mergeToDevelopment: {
    options: {
      commands: [
        { operation: 'status', result: { uncommitted: false }, remember: ['currentBranch'] },
        { operation: 'tag' }
      ]
    }
  }
});
