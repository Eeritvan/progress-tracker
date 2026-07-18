import { type Accessor, createContext, createSignal, onMount, ParentComponent, type Setter, useContext } from "solid-js"
import { API_URL } from "../constants"

declare global {
  interface Window {
    __USER__?: User;
  }
}

export interface User {
  id: string;
  name: string;
}

interface UserContextValue {
  user: Accessor<User | undefined>;
  setUser: Setter<User | undefined>;
}

const UserContext = createContext<UserContextValue>(undefined)

export const UserContextProvider: ParentComponent = (props) => {
  const [user, setUser] = createSignal(window.__USER__)

  // window.__user__ is empty in dev mode so we need to fetch it separately
  onMount(() => {
    if (!import.meta.env.DEV) return

    void (async () => {
      const response = await fetch(`${API_URL}/dev/me`, {
        credentials: "include",
      })

      if (response.ok) {
        setUser(await response.json())
      }
    })()
  })

  return (
    <UserContext.Provider value={{user, setUser}}>
      {props.children}
    </UserContext.Provider>
  )
}

export const useUserContext = () => {
  const context = useContext(UserContext)

  if (!context) {
    // todo: error message + handling
    throw new Error("error")
  }

  return context
}
