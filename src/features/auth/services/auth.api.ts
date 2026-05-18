import { fetchJson } from "../../../config/api";
import type { User } from "../types";

export const loginApi = async (
  email: string,
  password: string
): Promise<{ user: User; token: string }> => {
  return fetchJson('/api/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
};

export const registerApi = async (
  name: string,
  email: string,
  password: string
): Promise<{ user: User; token: string }> => {
  return fetchJson('/api/auth/register', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
};
