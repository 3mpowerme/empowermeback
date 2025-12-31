export function paymentSuccessTemplate({ paymentIntent }) {
  const amount = paymentIntent?.amount || 0
  const currency = String(paymentIntent?.currency || '').toUpperCase()
  const paymentIntentId = String(paymentIntent?.id || '')
  const description = paymentIntent?.description
    ? String(paymentIntent.description)
    : 'Pago de servicio'
  const created = Number(paymentIntent?.created || 0)
  const createdDate = created ? new Date(created * 1000) : new Date()

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

  const formattedDate = new Intl.DateTimeFormat('es-CL', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(createdDate)

  const subject = 'Pago confirmado'
  const text =
    `Pago confirmado.\n` +
    `Monto: ${formattedAmount}\n` +
    `Concepto: ${description}\n` +
    `Fecha: ${formattedDate}\n` +
    `ID pago: ${paymentIntentId}\n`

  const html = `
  <div style="background:#f6f7fb;padding:24px 0">
    <div style="max-width:620px;margin:0 auto;padding:0 16px">
      <div style="background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 10px 30px rgba(16,24,40,.08)">
        <div style="padding:22px 22px 14px;background:linear-gradient(135deg,#111827 0%,#0f172a 55%,#111827 100%)">
          <div style="font-family:Arial,sans-serif;color:#8347cc;font-size:14px;opacity:.9">EmpowerMe</div>
          <div style="font-family:Arial,sans-serif;color:#8347cc;font-size:22px;font-weight:700;margin-top:6px">Pago confirmado</div>
          <div style="font-family:Arial,sans-serif;color:#8347cc;font-size:13px;margin-top:6px;line-height:1.4">
            Tu pago fue procesado correctamente.
          </div>
        </div>

        <div style="padding:18px 22px 8px">
          <div style="display:flex;gap:12px;align-items:flex-start">
            <div style="width:44px;height:44px;border-radius:12px;background:#ecfdf3;border:1px solid #d1fadf;display:flex;align-items:center;justify-content:center;margin-right: 10px">
              <div style="font-family:Arial,sans-serif;font-size:22px;color:#12b76a;font-weight:700">✓</div>
            </div>
            <div style="flex:1">
              <div style="font-family:Arial,sans-serif;font-size:14px;color:#000;font-weight:700">${formattedAmount}</div>
              <div style="font-family:Arial,sans-serif;font-size:13px;color:#000;margin-top:2px;line-height:1.45">
                ${description}
              </div>
              <div style="font-family:Arial,sans-serif;font-size:12px;color:#667085;margin-top:10px">
                Fecha: <span style="color:#111827">${formattedDate}</span>
              </div>
            </div>
          </div>

          <div style="margin-top:16px;border-top:1px solid #eaecf0"></div>

          <div style="margin-top:14px">
            <div style="font-family:Arial,sans-serif;font-size:12px;color:#667085;margin-bottom:10px">Detalles</div>

            <table style="width:100%;border-collapse:separate;border-spacing:0 10px">
              <tr>
                <td style="font-family:Arial,sans-serif;font-size:12px;color:#667085;width:40%">ID del pago</td>
                <td style="font-family:Arial,sans-serif;font-size:12px;color:#111827;font-weight:600;word-break:break-all">${paymentIntentId}</td>
              </tr>
              <tr>
                <td style="font-family:Arial,sans-serif;font-size:12px;color:#667085">Moneda</td>
                <td style="font-family:Arial,sans-serif;font-size:12px;color:#111827;font-weight:600">${currency}</td>
              </tr>
            </table>
          </div>
        </div>

        <div style="padding:14px 22px 18px;background:#ffffff">
          <div style="font-family:Arial,sans-serif;font-size:11px;color:#98a2b3;line-height:1.45">
            Este es un mensaje automático. Si no reconoces este pago, contáctanos.
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
