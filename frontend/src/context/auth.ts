import { createSignal } from "solid-js"
import { API_URL } from "../lib/constants";

declare global {
  interface Window {
    __USER__?: User;
  }
}

export interface User {
  id: string;
  name: string;
}

const [user, setUser] = createSignal<User | undefined>(window.__USER__)

// window.__user__ is empty in dev mode so we need to fetch it separately
if (import.meta.env.DEV) {
  const response = await fetch(`${API_URL}/dev/me`, {
    method: 'GET',
    credentials: 'include'
  });

  if (response.ok) {
    setUser(await response.json())
  }
}

const isAuthenticated = () => user() !== null

export { user, setUser, isAuthenticated }
