// All trip-related API calls live here
const API_URL = process.env.NEXT_PUBLIC_API_URL

export type LabeledOption = {
  value: string;  // English — stored in DB, embedded in AI prompt
  label: string;  // Indonesian — displayed in UI
}

export type TripOptions = {
  currencies:      string[];
  travel_styles:   LabeledOption[];
  months:          LabeledOption[];
  categories:      string[];
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
  search?:       string;
  currency?:     string;
  category?:     string;
  travel_style?: string;
  travel_month?: string;
  sort_by?:      TripSortBy;
  page?:         number;
  page_size?:    number;
}

export type TripListResponse = {
  data:        Trip[];
  total:       number;
  page:        number;
  page_size:   number;
  total_pages: number;
}

export async function getOptions(): Promise<TripOptions> {
  const res = await fetch(`${API_URL}/trips-options`, { cache: 'force-cache' })
  return res.json()
}

export async function getTrips(params: TripListParams = {}): Promise<TripListResponse> {
  const query = new URLSearchParams()

  if (params.search)       query.set('search',       params.search)
  if (params.currency)     query.set('currency',     params.currency)
  if (params.category)     query.set('category',     params.category)
  if (params.travel_style) query.set('travel_style', params.travel_style)
  if (params.travel_month) query.set('travel_month', params.travel_month)
  if (params.sort_by)      query.set('sort_by',      params.sort_by)
  if (params.page)         query.set('page',         String(params.page))
  if (params.page_size)    query.set('page_size',    String(params.page_size))

  const url = query.size > 0 ? `${API_URL}/trips?${query}` : `${API_URL}/trips`
  const res = await fetch(url, { cache: 'no-store' })
  return res.json()
}

export async function getTrip(id: number) {
  const res = await fetch(`${API_URL}/trips/${id}`)
  return res.json()
}

export async function generateTrip(data: TripPayload) {
  const res = await fetch(`${API_URL}/trips`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  return res.json()
}
