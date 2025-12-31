export function exampleTemplate({ name }) {
  const safeName = name ? String(name).trim() : 'hola'

  return {
    subject: 'Bienvenido a EmpowerMe',
    text: `¡${safeName}! Bienvenido a EmpowerMe.`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.5">
        <h2>¡${safeName}!</h2>
        <p>Bienvenido a <b>EmpowerMe</b>.</p>
      </div>
    `,
  }
}
