import { API_URL } from "../../lib/constants";

export const login = async (body: any) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error('ggs');
  }
  console.log(response)

  return response.json();
};
