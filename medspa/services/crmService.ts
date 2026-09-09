// @ts-nocheck Transitional conversion: preserve the existing webhook payload contract.
/**
 * crmService.ts
 * Thin client for the server-side Google Sheets and Calendar booking API.
 *
 * Environment variables (set in .env):
 * Google credentials and resource IDs remain server-side.
 */

/**
 * Internal POST helper – sends booking actions to the server proxy.
 */
async function postBookingAction(payload) {
  // Use a relative path so the request stays same-origin and passes the
  // Content-Security-Policy (connect-src 'self'). The Vite dev server and
  // the production host both proxy /api to the backend on port 3001.
  const proxyUrl = '/api/medspa/crm';

  try {
    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (!response.ok) {
      return { success: false, error: result.error || `HTTP ${response.status}` };
    }
    return result;
  } catch (proxyErr) {
    console.error('[CRM] Server booking proxy failed:', proxyErr);
    return { success: false, error: 'Booking service is unavailable.' };
  }
}

/**
 * Append a new client lead row to the Google Sheet CRM.
 */
export async function saveClientToCRM({ name, phone, email, notes = '' }) {
  return postBookingAction({
    action: 'add_crm_lead',
    data: {
      name,
      phone,
      email,
      notes,
      source: 'Aura Voice AI',
      timestamp: new Date().toISOString()
    }
  });
}

/**
 * Create a consultation event on Google Calendar.
 */
export async function createCalendarEvent({ name, email, phone, preferredDate, preferredTime, notes = '' }) {
  return postBookingAction({
    action: 'create_calendar_event',
    event: {
      title: `VISIA Consultation – ${name}`,
      date: preferredDate,
      time: preferredTime,
      guestEmail: email,
      description: [
        `Client: ${name}`,
        `Phone: ${phone}`,
        `Email: ${email}`,
        `Notes: ${notes || ''}`,
        '',
        'Booked via Aura AI Voice Concierge – ÉLÉVATION MedSpa'
      ].join('\n')
    }
  });
}

/**
 * Convenience: saves to CRM and creates calendar event in parallel.
 */
export async function bookConsultation(params) {
  return postBookingAction({
    action: 'book_consultation',
    data: {
      companyName: 'ÉLÉVATION MedSpa',
      ...params
    }
  });
}
