const {run} = require('../index')
const expect = require('chai').expect

describe('Test:', () => {
  it('"(+ 2 2)" should be "4"', () => {
    expect(run('(+ 2 2)')).to.be.equal(4)
  })
  it('"(if nil 5 6)" should be "6"', () => {
    expect(run('(if nil 5 6)')).to.be.equal(6)
  })
  it('"(if 4 5 6)" should be "5"', () => {
    expect(run('(if 4 5 6)')).to.be.equal(5)
  })
  it('"(define circle-area (lambda (r) (* pi (* r r))))\n(circle-area 3)" should be "28.274333882308138"', () => {
    expect(run('(define circle-area (lambda (r) (* pi (* r r))))\n(circle-area 3)')).to.be.equal(28.274333882308138)
  })
  it('"(define fact (lambda (n) (if (<= n 1) 1 (* n (fact (- n 1))))))\n(fact 10)" should be "3628800"', () => {
    expect(run('(define circle-area (lambda (r) (* pi (* r r))))\n(circle-area 3)')).to.be.equal(28.274333882308138)
  })
  it('(define twice (lambda (x) (* 2 x)))\n(twice 5) should be "10', () => {
    expect(run('(define twice (lambda (x) (* 2 x)))\n(twice 5)')).to.be.equal(10)
  })
})
