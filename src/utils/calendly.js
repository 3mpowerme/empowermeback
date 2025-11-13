import axios from 'axios'
const CALENDLY_ACCESS_TOKEN = process.env.CALENDLY_ACCESS_TOKEN

export async function cancelCalendlyEvent(
  eventUri,
  reason = 'Cancelado por el usuario'
) {
  try {
    await axios.post(
      `${eventUri}/cancellation`,
      { reason },
      {
        headers: {
          Authorization: `Bearer ${CALENDLY_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    )

    console.log('event cancelled properly in Calendly')
    return true
  } catch (error) {
    console.error(
      'Error cancelling event:',
      error.response?.data || error.message
    )
    return false
  }
}

export async function getCalendlyEventData(eventUri) {
  try {
    const { data } = await axios.get(eventUri, {
      headers: {
        Authorization: `Bearer ${CALENDLY_ACCESS_TOKEN}`,
      },
    })

    const event = data.resource
    return {
      name: event.name,
      start_time: event.start_time,
      end_time: event.end_time,
      status: event.status,
      event_type: event.event_type,
      created_at: event.created_at,
      updated_at: event.updated_at,
    }
  } catch (err) {
    console.error(
      'Error fetching Calendly event:',
      err.response?.data || err.message
    )
    throw err
  }
}
