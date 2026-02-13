export function withTimeout(promise, ms = 60000) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(new Error('Timeout')), ms)
  return Promise.race([
    promise,
    new Promise((_, rej) => ctrl.signal.addEventListener('abort', rej)),
  ]).finally(() => clearTimeout(t))
}

export function parseJsonValues(obj) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value)
          if (parsed && typeof parsed === 'object') {
            return [key, parsed]
          }
        } catch (e) {}
      }
      return [key, value]
    })
  )
}

export function getPostRedirectUrlByUserType(userType, userHasCompany) {
  let postLoginRedirect = '/dashboard'
  if (userType == 1) {
    // admin
    postLoginRedirect = '/dashboard/panel'
  }
  if (userType == 2) {
    // executive
    postLoginRedirect = '/dashboard/services'
  }

  if (userType == 3 && userHasCompany) {
    // customer with company
    postLoginRedirect = '/dashboard/buildCompany'
  }

  if (userType == 3 && !userHasCompany) {
    // customer without company
    postLoginRedirect = '/dashboard/conceptualization'
  }
  return postLoginRedirect
}
