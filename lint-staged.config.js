// lint-staged.config.js
module.exports = {
  '*.@(ts|tsx)': ['yarn lint', 'yarn format'],
};
