/* eslint-disable no-console,max-len */

/*
 * Note: don't use any non-node-native dependency here as this script is
 * executed before any of them is installed.
 *
 * source: https://github.com/ampproject/amphtml/blob/main/build-system/common/check-package-manager.js
 */

const red = text =>
  '\x1b[31m' + text + '\x1b[0m';

const green = text =>
  '\x1b[32m' + text + '\x1b[0m';

const cyan = text =>
  '\x1b[36m' + text + '\x1b[0m';

const bold = text =>
  '\x1b[1m' + text + '\x1b[0m';

if (!process.env.npm_execpath?.includes('npm')) {
  console.log('\n');
  console.log(red(
    '*** Oak now uses npm to install dependencies, please use it ' +
    'instead of yarn ***'
  ));
  console.log('\n');
  console.log(cyan(
    'Yarn v1 has issues with many duplicate peer dependencies that ' +
    'won\'t be fixed (as it has reached end of life), \nand Yarn >= v2 is ' +
    'a change of mindset that requires too much efforts from everybody ' +
    'to be adopted painlessly \nand we are simply against.'
  ));
  console.log('\n');
  console.log('⤷ To install dependencies, run:', bold(green('npm i')), 'or',
    bold(green('npm install')));
  console.log('⤷ To add a dependency to a particular workspace, run:',
    bold(green('npm i <package> -w <workspace>')));
  console.log('⤷ To run a script, run:', bold(green('npm run <script>')));
  console.log('\n');

  process.exit(1);
}
