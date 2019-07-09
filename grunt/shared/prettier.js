//MWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMW
//MW  GRUNT TASK CONFIGURATION: PRETTIER
//MWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMW

let prettier = (module.exports = {
  options: {
    check: false
  },
  all: {
    options: {},
    files: [
      {
        src: [
          '{lib,templates,grunt}/**/*.{js,json,html,html,hbs,yaml}',
          '*.{js,json,html,html,hbs,yaml}'
        ]
      }
    ]
  },
  js: {
    options: {},
    files: [
      {
        src: ['**/*.js', '!node_modules/**', '!dist/**', '!stage/**']
      }
    ]
  },
  json: {
    options: {
      check: false
    },
    files: [
      {
        src: ['**/*.json', '!node_modules/**', '!dist/**', '!stage/**']
      }
    ]
  },
  yaml: {
    options: {},
    files: [
      {
        src: ['**/*.yaml', '!node_modules/**', '!dist/**', '!stage/**']
      }
    ]
  },
  hbs: {
    options: {},
    files: [
      {
        src: ['**/*.hbs', '!node_modules/**', '!dist/**', '!stage/**']
      }
    ]
  },
  html: {
    options: {},
    files: [
      {
        src: ['**/*.{htm|html}', '!node_modules/**', '!dist/**', '!stage/**']
      }
    ]
  }
});
