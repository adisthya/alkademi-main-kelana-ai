// All trip-related API calls live here
const API_URL = process.env.NEXT_PUBLIC_API_URL
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
  ai_recommendation?: string;
}

export async function getTrips() {
  const res = await fetch(`${API_URL}/trips`)
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
