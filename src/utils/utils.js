export function withTimeout(promise, ms = 60000) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(new Error('Timeout')), ms)
  return Promise.race([
    promise,
    new Promise((_, rej) => ctrl.signal.addEventListener('abort', rej)),
  ]).finally(() => clearTimeout(t))
}
