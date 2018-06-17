const {run} = require('./index')
const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'jisty> '
})

rl.prompt()

rl.on('line', (line) => {
  if (line === '-h' || line === '--help') {
    console.log('Input lisp expression, enter to run it...')
    console.log('ctrl+d to quit')
  } else {
    console.log(run(line))
  }
  rl.prompt()
}).on('close', () => {
  console.log('Have a great day!')
  process.exit(0)
})
