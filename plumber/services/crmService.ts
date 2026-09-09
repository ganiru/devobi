// @ts-nocheck Transitional conversion: preserve the existing component API.
/**
 * CRM Service for Joe's Reliable Plumbing - Browser Proxy
 * 
 * All Google Calendar / Sheets / Email operations run server-side via
 * /api/plumber/crm. This module simply serializes the request and returns
 * the response so the voice-agent tool-calling flow stays identical.
 */

export interface CustomerData {
  name: string;
  phone: string;
  email: string;
  preferredDate: string; // YYYY-MM-DD
  preferredTime: string; // HH:mm (24-hour format)
  notes?: string; // Emergency repair, drain cleaning, etc.
  plumberNote?: string; // Comments for the team
  companyName?: string; // Reflected in the calendar event title and confirmation email
}

export interface CRMResponse {
  success: boolean;
  row?: number;
  error?: string;
}

export interface CalendarEvent {
  success: boolean;
  eventId?: string;
  eventLink?: string;
  summary: string;
  description: string;
  start: string; // ISO timestamp
  end: string; // ISO timezone-aware timestamp
  location?: string;
}

export interface EmailResponse {
  success: boolean;
  error?: string;
}

export async function bookConsultation(customerData: CustomerData): Promise<CRMResponse & { calendar: CalendarEvent, email: EmailResponse }> {
  try {
    const res = await fetch('/api/plumber/crm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'book_consultation',
        data: {
          companyName: "Joe's Reliable Plumbing",
          ...customerData
        }
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Server returned ${res.status}: ${errText}`);
    }

    return await res.json();
  } catch (error: any) {
    console.error('[CRM] Booking failed:', error);
    return {
      success: false,
      error: error.message,
      calendar: { success: false, summary: '', description: '', start: '', end: '' },
      email: { success: false, error: error.message }
    };
  }
}

export async function retrieveCustomerById(_customerId: string): Promise<CustomerData | null> {
  // Not implemented for plumber demo
  return null;
}

export async function updateCustomerNote(_customerId: string, _note: string): Promise<boolean> {
  // Not implemented for plumber demo
  return true;
}
