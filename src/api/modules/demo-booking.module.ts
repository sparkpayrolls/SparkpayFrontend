import { HttpRepository } from '../repo/http.repo';

export type AvailabilityDays = {
  year: number;
  month: number;
  availableDays: number[];
};

export type SlotItem = { startTime: string; endTime: string };

export type AvailabilitySlots = { timezone: string; slots: SlotItem[] };

export type CreateDemoBookingPayload = {
  name: string;
  email: string;
  phone: string;
  companyName: string;
  employeeSize?: string;
  notes?: string;
  startTime: string; // ISO UTC
  timezone: string;
  guestEmails?: string[];
  website?: string; // honeypot — always left empty
};

export type BookingResult = {
  reference: string;
  startTime?: string;
  status: string;
};

export type ManagedBooking = {
  reference: string;
  startTime: string;
  endTime: string;
  timezone: string;
  status: string;
  meetingLink?: string;
};

export class DemoBookingModule extends HttpRepository {
  async getAvailableDays(year: number, month: number, timezone?: string) {
    const { data } = await this.get<AvailabilityDays>(
      '/demo-bookings/availability/days',
      { params: { year, month, timezone } },
    );
    return data;
  }

  async getAvailableSlots(date: string, timezone: string) {
    const { data } = await this.get<AvailabilitySlots>(
      '/demo-bookings/availability/slots',
      { params: { date, timezone } },
    );
    return data;
  }

  async createBooking(payload: CreateDemoBookingPayload) {
    const { data } = await this.post<BookingResult>('/demo-bookings', payload);
    return data;
  }

  async getByToken(token: string) {
    const { data } = await this.get<ManagedBooking>(
      `/demo-bookings/manage/${token}`,
    );
    return data;
  }

  async cancelByToken(token: string) {
    const { data } = await this.post<BookingResult>(
      `/demo-bookings/cancel/${token}`,
      {},
    );
    return data;
  }
}
