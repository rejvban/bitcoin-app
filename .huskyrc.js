// .huskyrc.js
module.exports = {
  hooks: {
    'pre-commit': 'lint-staged',
    'pre-push': 'yarn run type-check',
  },
};