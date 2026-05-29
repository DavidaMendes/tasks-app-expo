import { useAuthStore } from '../store/useAuthStore';
 
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
 
function getHeaders(): HeadersInit {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = useAuthStore.getState().token;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}
 
export async function loginAPI(data: {
  email: string;
  password: string;
}): Promise<{ token: string; user: { id: string; name: string; email: string } }> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
 
  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Falha ao fazer login' }));
    throw new Error(err.error || 'Falha ao fazer login');
  }
 
  return await response.json();
}
 
export async function signupAPI(data: {
  name: string;
  email: string;
  password: string;
}): Promise<{ token: string; user: { id: string; name: string; email: string } }> {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
 
  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Falha ao criar conta' }));
    throw new Error(err.error || 'Falha ao criar conta');
  }
 
  return await response.json();
}
 
export async function logoutAPI(): Promise<void> {
  await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    headers: getHeaders(),
  });
}