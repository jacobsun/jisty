const tokenize = str => str.replace(/\(/g, ' ( ').replace(/\)/g, ' ) ').split(' ').filter(e => e !== '')
const parse = program => readFromTokens(tokenize(program))

const readFromTokens = tokens => {
  if(tokens.length === 0)
    throw new Error('Unexpected EOF')
  const token = tokens.shift()
  if (token === '(') {
    const nested = []
    while (tokens[0] !== ')') {
      nested.push(readFromTokens(tokens))
    }
    tokens.shift()
    return nested
  } else if (token === ')') {
    throw new Error('Unexpected )')
  } else {
    return atom(token)
  }
}

const Symbol = String

const atom = token => {
  if (isNaN(token))
    return token
  return +token
}


const standard = {
  'nil': null,
  't': true,
  '+': (x, y) => x + y,
  '-': (x, y) => x - y,
  '*': (x, y) => x * y,
  '/': (x, y) => x / y,
  '%': (x, y) => x % y,
  'remainder': (x, y) => x % y,
  '>': (x, y) => x > y,
  '<': (x, y) => x > y,
  '>=': (x, y) => x >= y,
  '<=': (x, y) => x <= y,
  '=': (x, y) => x === y,
  'equal?': (x, y) => x === y,
  'eq?': (x, y) => x === y,
  'length': (x) => x ? x.length : 0,
  'cons': (x, y) => {let arr = [x]; return arr.concat(y) },
  'car': (x) => x && x.length ? x[0] : null,
  'cdr': x => x && (x.length > 1) ? x.slice(1) : null,
  'append': (x, y) => x.concat(y),
  'list': (...args) => args,
  'list?': (x) => Array.isArray(x),
  'null?': (x) => x == null,
  'symbol?': (x) => typeof x === 'string',
  'pi': Math.PI
}

Object.getOwnPropertyNames(Math).forEach( x => standard[x] = Math[x])

const _env = {params: [], args: [], upper: undefined}
// spec: new inner env
const createEnv = spec => {
  const env = {}
  const upper = spec.upper || undefined
  env.getUpper = () => upper
  env.find = variable => {
    if(env.hasOwnProperty(variable))
      return env[variable]
    if (upper === undefined) {
        throw new Error(`${variable} couldn't be identified`)
      }
    return upper.find(variable)
  }
  // use arguments value to set lambda parameters,
  if (spec.params.length) {
    for(let i = 0; i < spec.params.length; i++) {
      env[spec.params[i]] = spec.args[i]
    }
  }
  return env
}

const ENV = Object.assign(createEnv(_env), standard)

const eval = (x, env = ENV) => {

  if (typeof x === 'number') {
    return x
  }
  if (typeof x === 'string') {
    return env.find(x)
  }
  if (x[0] === 'quote') {
    return x[1]
  }
  if (x[0] === 'if') {
    x.shift()
    const [predicate, tExpr, fExpr] = x
    if (eval(predicate, env)) {
      return eval(tExpr, env)
    }
    return eval(fExpr, env)
  }
  if (x[0] === 'define') {
    x.shift()
    const [idfr, v] = x
    env[idfr] = eval(v, env)
    return
  }
  if (x[0] === 'lambda') { //(lambda (r) (* pi (* r r)))
    x.shift()
    const [para, exp] = x
    return (...args) => eval(exp, createEnv({params: para, args: args, upper: env}))
  }
  const expr = x.map(l => eval(l, env))
  const proc = expr.shift()
  if (proc && typeof proc === 'function') {
    return proc.apply(env, expr)
  }
}

const run = code => {
  let ret
  code = code.toString().split('\n').filter(l => l.length > 0)
  code.forEach(line => {
    ret = eval(parse(line), ENV)
  })
  return ret
}

if (typeof process !== 'undefined') {
  module.exports =  {
    run
  }
} else {
  window.run = run
}
