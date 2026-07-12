import { API_URL } from "../../lib/constants";

export const register = async (body: any) => {
  console.log(body)
  const response = await fetch(`${API_URL}/auth/signup`, {
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
