import { JoinPayload, LoginPayload, LoginResponse } from '@/lib/definitiions/auth';
import { apiFetch } from '../lib/api-client';

export async function postLogin(payload: LoginPayload): Promise<LoginResponse> {
  return await apiFetch<LoginResponse>(`/auth/login`, {
    method: "POST",
    body: payload
  });
}

export async function deleteLogout() {
  return await apiFetch(`/auth/logout`, {
    method: "DELETE",
  });
}

export async function postJoinUser(payload: JoinPayload) {
  return await apiFetch(`/auth/join`, {
    method: "POST",
    body: payload
  });;
}

