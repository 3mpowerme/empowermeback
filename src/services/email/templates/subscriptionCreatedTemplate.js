export function subscriptionCreatedTemplate({
  subscription,
  serviceName,
  planName,
  companyName,
  isCancelled,
}) {
  const subscriptionId = String(subscription?.id || '')
  const status = String(subscription?.status || '')
  const currency = String(subscription?.currency || '').toUpperCase()

  const plan =
    subscription?.plan || subscription?.items?.data?.[0]?.plan || null
  const price = subscription?.items?.data?.[0]?.price || null

  const amount = Number(plan?.amount ?? price?.unit_amount ?? 0)

  const interval = String(
    plan?.interval ?? price?.recurring?.interval ?? 'month'
  )

  const intervalCount = Number(
    plan?.interval_count ?? price?.recurring?.interval_count ?? 1
  )

  const created = Number(subscription?.created || subscription?.start_date || 0)
  const createdDate = created ? new Date(created * 1000) : new Date()

  const currentPeriodStart = Number(
    subscription?.items?.data?.[0]?.current_period_start || 0
  )
  const currentPeriodEnd = Number(
    subscription?.items?.data?.[0]?.current_period_end || 0
  )

  const formattedAmount =
    currency === 'CLP'
      ? new Intl.NumberFormat('es-CL', {
          style: 'currency',
          currency: 'CLP',
          maximumFractionDigits: 0,
        }).format(amount)
      : new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currency || 'USD',
        }).format(amount)

  const intervalLabel = (() => {
    const map = { day: 'día', week: 'semana', month: 'mes', year: 'año' }
    const base = map[interval] || interval
    if (intervalCount === 1) return base
    if (base === 'mes') return `${intervalCount} meses`
    if (base === 'año') return `${intervalCount} años`
    if (base === 'semana') return `${intervalCount} semanas`
    if (base === 'día') return `${intervalCount} días`
    return `${intervalCount} ${base}`
  })()

  const formattedDate = new Intl.DateTimeFormat('es-CL', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(createdDate)

  const formattedPeriodStart = currentPeriodStart
    ? new Intl.DateTimeFormat('es-CL', {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
      }).format(new Date(currentPeriodStart * 1000))
    : ''

  const formattedPeriodEnd = currentPeriodEnd
    ? new Intl.DateTimeFormat('es-CL', {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
      }).format(new Date(currentPeriodEnd * 1000))
    : ''

  const companyId = subscription?.metadata?.company_id
    ? String(subscription.metadata.company_id)
    : ''
  const serviceId = subscription?.metadata?.service_id
    ? String(subscription.metadata.service_id)
    : ''
  const planId = subscription?.metadata?.plan_id
    ? String(subscription.metadata.plan_id)
    : ''

  const subject = isCancelled
    ? status === 'active'
      ? 'Suscripción cancelada.'
      : 'Suscripción deshabilitada.'
    : 'Suscripción creada'
  const text =
    `Suscripción creada.\n` +
    `Monto recurrente: ${formattedAmount} / ${intervalLabel}\n` +
    `Fecha: ${formattedDate}\n` +
    `ID suscripción: ${subscriptionId}\n` +
    (formattedPeriodStart && formattedPeriodEnd
      ? `Período: ${formattedPeriodStart} - ${formattedPeriodEnd}\n`
      : '') +
    (status ? `Estado: ${status}\n` : '') +
    (planId ? `Plan: ${planId}\n` : '') +
    (serviceId ? `Servicio: ${serviceId}\n` : '') +
    (companyId ? `Empresa: ${companyId}\n` : '')

  const statusCopy = (() => {
    if (status === 'active') return 'Tu suscripción está activa.'
    if (status === 'trialing')
      return 'Tu suscripción inició en período de prueba.'
    if (status === 'incomplete')
      return 'Tu suscripción fue creada y está pendiente de completar el pago.'
    if (status === 'past_due') return 'Tu suscripción está pendiente de pago.'
    if (status === 'canceled') return 'Tu suscripción fue deshabilitada.'
    if (isCancelled) return 'Tu pago recurrente fue cancelado'
    return 'Tu suscripción fue creada.'
  })()

  const title = (() => {
    if (isCancelled && status === 'active') return 'Suscripción cancelada.'
    if (isCancelled && status === 'canceled')
      return 'Suscripción deshabilitada.'
    return 'Suscripción creada'
  })()

  const html = `
  <div style="background:#f6f7fb;padding:24px 0">
    <div style="max-width:620px;margin:0 auto;padding:0 16px">
      <div style="background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 10px 30px rgba(16,24,40,.08)">
        <div style="padding:22px 22px 14px;background:linear-gradient(135deg,#111827 0%,#0f172a 55%,#111827 100%)">
          <div style="font-family:Arial,sans-serif;color:#8347cc;font-size:14px;opacity:.9">EmpowerMe</div>
          <div style="font-family:Arial,sans-serif;color:#8347cc;font-size:22px;font-weight:700;margin-top:6px">${title}</div>
          <div style="font-family:Arial,sans-serif;color:#8347cc;font-size:13px;margin-top:6px;line-height:1.4">
            ${statusCopy}
          </div>
        </div>

        <div style="padding:18px 22px 8px">
          <div style="display:flex;gap:12px;align-items:flex-start">
            <div style="width:44px;height:44px;border-radius:12px;background:#eef4ff;border:1px solid #d1e0ff;display:flex;align-items:center;justify-content:center; margin-right: 10px">
              <div style="font-family:Arial,sans-serif;font-size:18px;color:${isCancelled ? '#f63b3bff' : '#3b82f6'};font-weight:700">${isCancelled ? `X` : `⟳`}</div>
            </div>
            <div style="flex:1">
              ${status !== 'canceled' ? `<div style="font-family:Arial,sans-serif;font-size:14px;color:#000;font-weight:700">${formattedAmount} / ${intervalLabel}</div>` : ''}
              ${
                !isCancelled
                  ? `<div style="font-family:Arial,sans-serif;font-size:13px;color:#000;margin-top:2px;line-height:1.45">
                Pago recurrente configurado
              </div>`
                  : status === 'active'
                    ? `<div style="font-family:Arial,sans-serif;font-size:13px;color:#000;margin-top:2px;line-height:1.45">
                Pago recurrente cancelado, tu subscripción continua activa hasta finalizar el periodo
              </div>`
                    : `<div style="font-family:Arial,sans-serif;font-size:13px;color:#000;margin-top:2px;line-height:1.45">
                Tu subscripción esta desactivada
              </div>`
              }
              <div style="font-family:Arial,sans-serif;font-size:12px;color:#667085;margin-top:10px">
                Fecha: <span style="color:#111827">${formattedDate}</span>
              </div>
              ${
                !isCancelled && formattedPeriodStart && formattedPeriodEnd
                  ? `<div style="font-family:Arial,sans-serif;font-size:12px;color:#667085;margin-top:6px">
                       Próximo período: <span style="color:#111827">${formattedPeriodStart} - ${formattedPeriodEnd}</span>
                     </div>`
                  : ''
              }
            </div>
          </div>

          <div style="margin-top:16px;border-top:1px solid #eaecf0"></div>

          <div style="margin-top:14px">
            <div style="font-family:Arial,sans-serif;font-size:12px;color:#667085;margin-bottom:10px">Detalles</div>

            <table style="width:100%;border-collapse:separate;border-spacing:0 10px">
              <tr>
                <td style="font-family:Arial,sans-serif;font-size:12px;color:#667085;width:40%">ID de suscripción</td>
                <td style="font-family:Arial,sans-serif;font-size:12px;color:#111827;font-weight:600;word-break:break-all">${subscriptionId}</td>
              </tr>
              ${
                status
                  ? `<tr>
                      <td style="font-family:Arial,sans-serif;font-size:12px;color:#667085">Estado</td>
                      <td style="font-family:Arial,sans-serif;font-size:12px;color:#111827;font-weight:600">${status}</td>
                    </tr>`
                  : ''
              }
              <tr>
                <td style="font-family:Arial,sans-serif;font-size:12px;color:#667085">Moneda</td>
                <td style="font-family:Arial,sans-serif;font-size:12px;color:#111827;font-weight:600">${currency}</td>
              </tr>
              ${
                planName
                  ? `<tr>
                      <td style="font-family:Arial,sans-serif;font-size:12px;color:#667085">Plan</td>
                      <td style="font-family:Arial,sans-serif;font-size:12px;color:#111827;font-weight:600">${planName}</td>
                    </tr>`
                  : ''
              }
              ${
                serviceName
                  ? `<tr>
                      <td style="font-family:Arial,sans-serif;font-size:12px;color:#667085">Servicio</td>
                      <td style="font-family:Arial,sans-serif;font-size:12px;color:#111827;font-weight:600">${serviceName}</td>
                    </tr>`
                  : ''
              }
              ${
                companyName
                  ? `<tr>
                      <td style="font-family:Arial,sans-serif;font-size:12px;color:#667085">Empresa</td>
                      <td style="font-family:Arial,sans-serif;font-size:12px;color:#111827;font-weight:600">${companyName}</td>
                    </tr>`
                  : ''
              }
            </table>
          </div>
        </div>

        <div style="padding:14px 22px 18px;background:#ffffff">
          <div style="font-family:Arial,sans-serif;font-size:11px;color:#98a2b3;line-height:1.45">
            Este es un mensaje automático. Si no reconoces esta suscripción, contáctanos.
          </div>
        </div>
      </div>

      <div style="text-align:center;font-family:Arial,sans-serif;font-size:11px;color:#98a2b3;margin-top:14px">
        © ${new Date().getFullYear()} EmpowerMe
      </div>
    </div>
  </div>
  `

  return { subject, text, html }
}
