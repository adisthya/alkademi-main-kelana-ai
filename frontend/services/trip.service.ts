import { apiFetch } from '../lib/api-client';

export type LabeledOption = {
  value: string;  // English — stored in DB, embedded in AI prompt
  label: string;  // Indonesian — displayed in UI
}

export type TripOptions = {
  currencies: string[];
  travel_styles: LabeledOption[];
  months: LabeledOption[];
  categories: string[];
  transportations: string[];
}

export type TripPayload = {
  destination: string;
  currency: string;
  budget: number;
  days: number;
  travel_style: string;
  travel_month: string;
}

export type TripUpdatePayload = {
  id: number;
  destination?: string;
  currency?: string;
  budget?: number;
  days?: number;
  travel_style?: string;
  travel_month?: string;
}

export type Trip = TripPayload & {
  id: number;
  user_id: number;
  travel_season: string;
  category: string;
  daily_budget: number;
  ai_recommendation?: string;
}

export type TripSortBy =
  | 'created_at_desc'
  | 'created_at_asc'
  | 'budget_desc'
  | 'budget_asc';

export type TripListParams = {
  search?: string;
  currency?: string;
  category?: string;
  travel_style?: string;
  travel_month?: string;
  sort_by?: TripSortBy;
  page?: number;
  page_size?: number;
}

export type TripListResponse = {
  data: Trip[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export async function getOptions(): Promise<TripOptions> {
  return apiFetch<TripOptions>(`/trips/options`, { cache: 'force-cache' });
}

export async function getTrips(params: TripListParams = {}): Promise<TripListResponse> {
  const query = new URLSearchParams()

  if (params.search) query.set('search', params.search)
  if (params.currency) query.set('currency', params.currency)
  if (params.category) query.set('category', params.category)
  if (params.travel_style) query.set('travel_style', params.travel_style)
  if (params.travel_month) query.set('travel_month', params.travel_month)
  if (params.sort_by) query.set('sort_by', params.sort_by)
  if (params.page) query.set('page', String(params.page))
  if (params.page_size) query.set('page_size', String(params.page_size))

  const url = query.size > 0 ? `/trips?${query}` : `/trips`

  console.log('url:', url);

  return apiFetch<TripListResponse>(url, { cache: 'no-store' });
}

export async function getTrip(id: number): Promise<Trip> {
  return apiFetch<Trip>(`/trips/${id}`, { credentials: 'include' });
}

export async function generateTrip(data: TripPayload): Promise<Trip> {
  return apiFetch(`/trips`, {
    method: "POST",
    body: data
  });
}
