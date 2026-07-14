import { createSignal } from "solid-js";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

const [user, setUser] = createSignal<User | null>(null);

const isAuthenticated = () => user() !== null;

export { user, setUser, isAuthenticated };
