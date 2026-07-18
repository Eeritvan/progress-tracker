import { ParentComponent, Show } from "solid-js"
import { Navigate } from "@solidjs/router"
import { useUserContext } from "../context/auth"

const ProtectedLayout: ParentComponent = (props) => {
  const { user } = useUserContext()

  return (
    <Show
      when={user()}
      fallback={<Navigate href="/login" />}
    >
      {props.children}
    </Show>
  )
}

export default ProtectedLayout
