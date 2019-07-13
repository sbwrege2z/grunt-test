'use strict';

const grunt = require('grunt');
const shell = require('shelljs');
const prompts = require('prompts');
const multitask = require('./multitask');
const dateFormat = require('date-fns').format;

//import * as grunt from 'grunt';
//import * as shell from 'shelljs';
//import * as prompts from 'prompts';
//import * as multitask from './multitask';
//import { format as dateFormat } from 'date-fns';

module.exports = {
  exec: execute
};

//export {
//	execute as exec
//};

/****************************************
 *
 *  operations
 *
 ****************************************/

async function promptConfirm(message, initial) {
  const question = [
    {
      type: 'confirm',
      name: 'value',
      message: message,
      initial: initial
    }
  ];
  let answer = await prompts(question);
  return answer.value;
}

/****************************************
 *
 *  operations
 *
 ****************************************/

let operations = {
  branch: branch,
  checkout: checkout,
  commit: commit,
  newBranch: newBranch,
  merge: merge,
  pull: pull,
  showBranches: showBranches,
  showTags: showTags,
  status: status,
  tag: tag,
  completeMerge: completeMerge,
  mergeToDevelopment
};

function shellExec(command, options) {
  grunt.log.writeln('\n$ ' + command);
  let info = shell.exec(command, options);

  if (info.stderr) {
    // there may be more info contained in the object
    grunt.log.writeln('\n> ' + command);
    grunt.log.writeln(
      JSON.stringify(
        {
          stderr: info.stderr,
          stdout: info.stdout,
          code: info.code
        },
        null,
        2
      )
    );
  }
  grunt.log.writeln('');
  return info;
}

/****************************************
 *
 *  execute
 *
 ****************************************/

function execute() {
  let { task, target, options } = multitask.initialize(this);
  shell.config.verbose = options.verbose;
  shell.config.silent = options.silent;
  shell.config.fatal = options.fatal;
  if (!shell.which('git')) {
    grunt.log.writeln('Sorry, this script requires git - stopping');
    shell.exit(1);
  }
  if (operations[target]) {
    return operations[target](task, options);
  } else {
    return fallback(task, options);
  }
}

/****************************************
 *
 *  asyncTask
 *
 ****************************************/

function asyncTask(task, options, fn) {
  let done = task.async();
  fn(task, options)
    .then(() => {
      done();
    })
    .catch((err) => {
      grunt.fail.fatal(err);
      done();
    });
}

/****************************************
 *
 *  commit
 *
 ****************************************/

function commitAsync(task, options) {
  return new Promise(function(resolve, reject) {
    grunt.log.writeln('committing and pushing changes ...');

    //
    //  confirm untracked files (if necessary)
    //

    let promptAdd = false;
    let info = status(task, options);
    if (info.untracked || info.merging) {
      grunt.log.writeln('\nUntracked files:');
      for (let file of info.untrackedFiles) grunt.log.writeln('- ' + file);
      grunt.log.writeln('');
      //Promise.resolve(false)
      promptConfirm('Would you like to add/commit these untracked files?', true)
        .then((result) => {
          promptAdd = result;
          commitAndPush();
        })
        .catch((err) => {
          grunt.fail.fatal(err);
          reject(err);
        });
    } else {
      commitAndPush();
    }

    function commitAndPush() {
      let result = null;
      if (promptAdd) shellExec('git add .', options);
      if (promptAdd || info.changes || info.uncommitted) {
        result = shellExec('git commit -a -m.', options);
        //grunt.log.writeln('commit output = ' + JSON.stringify(result));
        result = shellExec('git push', options);
        //grunt.log.writeln('push output = ' + JSON.stringify(result));
      }
      resolve(result);
    }
  });
}

function commit(task, options) {
  asyncTask(task, options, commitAsync);
}

/****************************************
 *
 *  status
 *
 ****************************************/

function status(task, options) {
  let info = shellExec('git status', { silent: options.silent });
  //grunt.log.writeln('info: "' + info + '"');
  let result = {};
  let match = info.match(/^On branch (.*?)\s/);
  if (match) {
    result.currentBranch = match[1];
  }
  result.changes = info.includes('Changes to be committed');
  result.uncommitted = info.includes('Changes not staged for commit');
  result.untracked = info.includes('Untracked files');
  result.ahead = info.includes('Your branch is ahead of');
  result.merging = info.includes('Unmerged paths');
  result.behind = info.includes('Your branch is behind');
  if (result.untracked || result.merging) {
    match = info.match(
      /(Unmerged paths|Untracked files):\s+\(use "git add <file>\.\.\." to (include in what will be committed|mark resolution)\)\n\n((\t[^\n]+\n)+)/
    );
    if (!match) grunt.fail.fatal('could not find untracked/merging files');
    let rawFiles = match[3];
    let untrackedFileArray = rawFiles.replace(/\t/gi, '').split('\n');
    untrackedFileArray.pop();
    result.untrackedFiles = untrackedFileArray;
  }
  grunt.log.writeln(JSON.stringify(result));
  return result;
}

/****************************************
 *
 *  showTags
 *
 ****************************************/

function showTags(task, options) {
  let info = shellExec('git tag');
  let tags = info.split('\n');
  tags.pop();
  let result = {};
  result.tags = tags;
  grunt.log.writeln('result = ' + JSON.stringify(result));
  return result;
}

/****************************************
 *
 *  tag
 *
 ****************************************/

function tag(task, options) {
  //grunt.log.writeln('calling tag(task = ' + JSON.stringify(task) + ', options = ' + JSON.stringify(options));
  let newTag = options.newTag;
  let info = shellExec('git tag -a -m. ' + newTag);
  info = shellExec('git push --follow-tags');
}

/****************************************
 *
 *  showBranches
 *
 ****************************************/

function showBranches(task, options) {
  let result = shellExec('git branch --all');
  let branches = result.split('\n');
  branches.pop();
  let currentBranch;
  let local = [];
  let remote = [];
  for (let branch of branches) {
    let expression = /^([* ]) (remotes\/origin\/)?([^\s]+)$/;
    let match = branch.match(expression);
    if (match) {
      if (match[1] === '*') currentBranch = match[3];
      if (match[2]) remote.push(match[3]);
      else local.push(match[3]);
    }
  }
  result = { local: local, remote: remote, current: currentBranch };
  //grunt.log.writeln('result = ' + JSON.stringify(result, null, 2));
  return result;
}

/****************************************
 *
 *  branch
 *
 ****************************************/

function branch(task, options) {
  let existingTag = options.existingTag;
  let newBranch = options.newBranch;
  shellExec('git branch ' + newBranch + ' ' + existingTag);
  shellExec('git push --follow-tags --set-upstream origin ' + newBranch);
  let info = simpleCheckout(task, { branch: newBranch });
  if (!info.branch || info.branch !== newBranch || !info.ok)
    grunt.fail.fatal('could not check out ' + newBranch);
}

/****************************************
 *
 *  newBranch
 *
 ****************************************/

function newBranch(task, options) {
  //
  //  log
  //

  grunt.log.writeln('options = ' + JSON.stringify(options));

  //
  //  arguments and validation
  //

  let prefix = options.prefix;
  let build = options.build;
  if (!prefix) grunt.fail.fatal('no prefix provided');
  let tags = showTags(task, options)
    .tags.filter(function(item) {
      return item.match(/^bld\d{6}[a-z]?(_[2-9])?$/);
    })
    .sort();
  if (build) {
    if (!tags.includes(build)) grunt.fail.fatal('build not found');
  } else {
    build = tags.pop();
  }

  //
  //  verify clean
  //

  verifyClean(task, options, true);

  //
  //  pull
  //

  pull(task, options);

  //
  //  determine new branch name
  //

  let baseBranch = build.replace(/^bld/, prefix);
  let newBranch = baseBranch;
  let branches = showBranches(task, options);
  let extraSuffix = 1;
  while (branches.local.includes(newBranch) || branches.remote.includes(newBranch)) {
    extraSuffix += 1;
    newBranch = baseBranch + '_' + extraSuffix;
  }
  if (branches.local.includes(newBranch)) grunt.fail.fatal('branch already exists locally');
  if (branches.remote.includes(newBranch)) grunt.fail.fatal('branch already exists on origin');

  //
  //  create branch
  //

  branch(task, { existingTag: build, newBranch: newBranch });
}

/****************************************
 *
 *  simpleCheckout
 *
 ****************************************/

function simpleCheckout(task, options) {
  let branch = grunt.option('branch') || options.branch;
  if (!branch) grunt.fail.fatal('no branch provided');
  let info = shellExec('git checkout ' + branch, { silent: options.silent });
  //grunt.log.writeln('info: ' + JSON.stringify(info));
  let result = {
    branch: branch,
    alreadyOn: info.stderr.includes('Already on'),
    switched: info.stderr.includes('Switched to branch'),
    checkedOut: info.stdout.includes(branch)
  };
  result.ok = (result.alreadyOn || result.switched) && result.checkedOut;
  grunt.log.writeln('checkout result: ' + JSON.stringify(result));
  return result;
}

/****************************************
 *
 *  checkout
 *
 ****************************************/

function checkout(task, options) {
  //
  //  verify arguments
  //

  let branch = grunt.option('branch') || options.branch;
  if (!branch) grunt.fail.fatal('no branch provided');

  //
  //  verify clean
  //

  verifyClean(task, options, true);

  //
  //  ensure latest code available
  //

  shellExec('git checkout development', { silent: options.silent });
  shellExec('git pull', { silent: options.silent });

  //
  //  checkout desired branch
  //

  let result = simpleCheckout(task, options);
  grunt.log.writeln('result: ' + JSON.stringify(result));
  result.ok = (result.alreadyOn || result.switched) && result.checkedOut;
  grunt.log.writeln('checkout result: ' + JSON.stringify(result));
  if (!result.ok) grunt.fail.fatal('checkout failed');
  return result;
}

/****************************************
 *
 *  pull
 *
 ****************************************/

function pull(task, options) {
  shellExec('git pull', { silent: options.silent });
  //let info = shellExec('git pull', { silent: options.silent });
  //grunt.log.writeln('pull result: ' + JSON.stringify(info));
}

/****************************************
 *
 *  merge
 *
 ****************************************/

function merge(task, options) {
  asyncTask(task, { branchFrom: 'dew190702c', branchTo: 'development' }, mergeAsync);
}

function mergeAsync(task, options) {
  return new Promise(function(resolve, reject) {
    //
    //  arguments
    //

    let branchTo = options.branchTo;
    let branchFrom = options.branchFrom;

    //
    //  verify clean working directory
    //

    verifyClean(task, options, true);

    //
    //  ensure up-to-date "from" branch
    //

    let info = simpleCheckout(task, { branch: branchFrom });
    if (!info.branch || info.branch !== branchFrom || !info.ok)
      grunt.fail.fatal('could not check out ' + branchFrom);
    info = pull(task, options);

    //
    //  ensure up-to-date "to" branch
    //

    info = simpleCheckout(task, { branch: branchTo });
    if (!info.branch || info.branch !== branchTo || !info.ok)
      grunt.fail.fatal('could not check out ' + branchTo);
    info = pull(task, options);

    //
    //  merge
    //

    info = shellExec('git merge ' + branchFrom + ' --squash', { silent: options.silent });
    //grunt.log.writeln('merge result: ' + JSON.stringify(info));
    if (info.includes('CONFLICT')) grunt.fail.fatal('trivial merge failed - resolve conflicts');

    //
    //  determine tag
    //

    let baseTag = 'bld' + dateFormat(new Date(), 'YYMMDD');
    grunt.log.writeln('baseTag: ' + baseTag);
    info = showTags(task, options);
    let foundTag = false;
    let newTag;
    let extra = 'a';
    while (!foundTag) {
      //
      //  identify candidate tag not yet used
      //  - bldYYMMDD
      //  - bldYYMMDDa
      //  - bldYYMMDDb
      //  - bldYYMMDDc
      //  - ... d, e, f, g, etc. ...
      //

      if (!newTag) newTag = baseTag;
      else if (newTag === baseTag) newTag = baseTag + 'a';
      else newTag = baseTag + nextChar(newTag.substring(9, 10));

      //
      //  ensure newTag not already used
      //

      foundTag = true;
      for (let existingTag of info.tags) {
        if (existingTag === newTag) {
          foundTag = false;
        }
      }
    }
    let result = {};
    grunt.log.writeln('creating tag: ' + newTag);
    result.newTag = newTag;

    //
    //  commit and tag
    //

    commitAsync(task, options)
      .then(() => {
        info = tag(task, { newTag: newTag });
        resolve(result);
      })
      .catch((err) => reject(err));
  });
}

/****************************************
 *
 *  nextChar
 *
 ****************************************/

function nextChar(c) {
  return String.fromCharCode(c.charCodeAt(0) + 1);
}

/****************************************
 *
 *  verifyClean
 *
 ****************************************/

function verifyClean(task, options, report) {
  let info = status(task, options);
  let clean = true;
  if (clean && info.changes) {
    if (report) grunt.fail.fatal('changes to commit in working directory');
    clean = false;
  }
  if (clean && info.uncommitted) {
    if (report) grunt.fail.fatal('uncommitted changes in working directory');
    clean = false;
  }
  if (clean && (info.untracked || info.merging)) {
    if (report) grunt.fail.fatal('untracked/merging files in working directory');
    clean = false;
  }
  if (clean && info.ahead) {
    if (report) grunt.fail.fatal('files in working directory not pushed');
    clean = false;
  }
  return clean;
}

/****************************************
 *
 *  mergeToDevelopment
 *
 ****************************************/

async function mergeToDevelopmentAsync(task, options) {
  //
  //  merge from existing branch to development
  //

  let info = status(task, options);
  let existingBranch = info.currentBranch;
  if (!existingBranch) grunt.fail.fatal('no git branch');
  if (existingBranch === 'development') grunt.fail.fatal('on development branch - exiting');
  if (existingBranch === 'master') grunt.fail.fatal('on master branch - exiting');
  let branchTo = 'development';

  //
  //  merge existing branch onto development
  //

  info = await mergeAsync(task, { branchTo: branchTo, branchFrom: existingBranch });
  let newTag = info.newTag;

  //
  //  create new branch - use prefix from existing branch and suffix from tag
  //  e.g., existing branch -> sbw190701
  //        new development build -> bld190702a
  //        yields new branch: sbw190702a
  //

  let match = existingBranch.match(/^([\D]+)\d.*?$/);
  let newBranchPrefix;
  if (match) {
    newBranchPrefix = match[1];
  }
  if (!newBranchPrefix) grunt.fail.fatal('could not determine prefix from ' + existingBranch);
  match = newTag.match(/^[\D]+(\d.*?)$/);
  let newBranchSuffix;
  if (match) {
    newBranchSuffix = match[1];
  }
  if (!newBranchSuffix) grunt.fail.fatal('could not determine suffix from ' + newTag);
  let newBranch = newBranchPrefix + newBranchSuffix;
  info = branch(task, { newBranch: newBranch, existingTag: newTag });
}

function mergeToDevelopment(task, options) {
  asyncTask(task, options, mergeToDevelopmentAsync);
}

/****************************************
 *
 *  completeMerge
 *
 ****************************************/

function completeMergeAsync(task, options) {
  return new Promise(function(resolve, reject) {
    //
    //  verify committed on development
    //

    let info = status(task, options);
    let existingBranch = info.currentBranch;
    if (!existingBranch) grunt.fail.fatal('no git branch');
    if (existingBranch != 'development')
      grunt.fail.fatal('completeMerge only works on development branch - exiting');
    if (info.changes) grunt.fail.fatal('changes to commit in working directory');
    if (info.uncommitted) grunt.fail.fatal('uncommitted changes in working directory');
    if (info.untracked || info.merging)
      grunt.fail.fatal('untracked/merging files in working directory');
    if (info.ahead) grunt.fail.fatal('files in working directory not pushed');

    //
    //  determine tag
    //

    let baseTag = 'bld' + dateFormat(new Date(), 'YYMMDD');
    grunt.log.writeln('baseTag: ' + baseTag);
    info = showTags(task, options);
    let foundTag = false;
    let newTag;
    let extra = 'a';
    while (!foundTag) {
      //
      //  identify candidate tag not yet used
      //  - bldYYMMDD
      //  - bldYYMMDDa
      //  - bldYYMMDDb
      //  - bldYYMMDDc
      //  - ... d, e, f, g, etc. ...
      //

      if (!newTag) newTag = baseTag;
      else if (newTag === baseTag) newTag = baseTag + 'a';
      else newTag = baseTag + nextChar(newTag.substring(9, 10));

      //
      //  ensure newTag not already used
      //

      foundTag = true;
      for (let existingTag of info.tags) {
        if (existingTag === newTag) {
          foundTag = false;
        }
      }
    }

    let result = {};
    grunt.log.writeln('creating tag: ' + newTag);
    result.newTag = newTag;

    //
    //  commit and tag
    //

    commitAsync(task, options)
      .then(() => {
        info = tag(task, { newTag: newTag });
        resolve(result);
      })
      .catch((err) => reject(err));
  });
}

function completeMerge(task, options) {
  asyncTask(task, options, completeMergeAsync);
}

/****************************************
 *
 *  fallback
 *
 ****************************************/

function fallback(task, options) {
  grunt.log.writeln('running ' + task.target);
  let commands = options.commands;
  if (commands) {
    for (let command of commands) {
      let result;
      let remember = {};
      if (operations[command.operation]) {
        grunt.log.writeln('git ' + command.operation);
        result = operations[command.operation](task, options);
      } else {
        grunt.log.writeln('Warning: The ' + command.operation + ' operation does not exist');
      }
      if (command.result) {
        if (typeof result !== 'object')
          grunt.fail.fatal('The ' + command.operation + ' command did not return an object');
        for (let key in command.result) {
          let value = command.result[key];
          if (result[key] !== value) {
            grunt.fail.fatal(
              'The ' +
                command.operation +
                ' does not contain expected result for ' +
                key +
                ', expected ' +
                value +
                ', found ' +
                result[key]
            );
          }
        }
      }
      if (command.remember) {
        for (let key of command.remember) {
          if (!result[key])
            grunt.fail.fatal(
              'The ' + command.operation + ' command does not contain expected key ' + key
            );
          remember[key] = result[key];
        }
      }
    }
  }
}
