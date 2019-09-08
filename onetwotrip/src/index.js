const { argv } = require('optimist');
const manager = require('./manager');
const { getErrors } = require('./errors');


const run = async () => {
  if (argv.getErrors) {
    const errorsInfo = await getErrors();
    console.log(errorsInfo);
    process.exit();
    return;
  }
  manager.init();
};

if (!module.parent) {
  run();
}

module.exports = {
  run,
};
