import { last, compose, partial, partialRight, curry, nth, range, multiply, sum } from 'ramda'
import { average, low, high, subArray } from './arrayMath'
import { CLOSE } from './cons'
import { mix } from './functional'

export const mapF = (data = [], f) => (f === undefined ? data : data.map(f))

const emaFormula = (n, today, yesterday) => {
  const k = 2 / (n + 1)
  return (k * today) + (yesterday * (1 - k))
}
const smaFormula = (n, today, yesterday) => {
  const k = 1 / n
  return (k * today) + (yesterday * (1 - k))
}
const wmaFormula = (n, data) => sum(mix(multiply, range(1, n + 1), data)) / (n * (n + 1) / 2)

// Moving Avarage
const _ma = (n, data) => data.reduce((pv, cv, idx) => (idx < (n - 1) ? pv.concat([0]) : pv.concat([average(n, idx, data)])), [])
// Smooth Moving Avarage
const _sma = (n, data) => data.reduce((pv, cv) => (last(pv) === undefined ? pv.concat(cv) : pv.concat(smaFormula(n, cv, last(pv)))), [])
// Exponential Moving Avarage
const _ema = (n, data) => data.reduce((pv, cv) => (last(pv) === undefined ? pv.concat(cv) : pv.concat(emaFormula(n, cv, last(pv)))), [])
// Weighted moving average
const _wma = (n, data) => data.reduce((pv, cv, idx) => (idx < (n - 1) ? pv.concat([0]) : pv.concat([wmaFormula(n, subArray(n, idx, data))])), [])
const _llv = (f, n, idx) => compose(partial(low, [n, idx]), partialRight(mapF, [f]))
const _hhv = (f, n, idx) => compose(partial(high, [n, idx]), partialRight(mapF, [f]))
const _close = (idx, data) => compose(CLOSE, nth(idx))(data)

export const ma = curry(_ma)
export const sma = curry(_sma)
export const ema = curry(_ema)
export const wma = curry(_wma)
export const llv = curry(_llv)
export const hhv = curry(_hhv)
export const close = curry(_close)
