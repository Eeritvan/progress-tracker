import { createForm } from "@tanstack/solid-form"
import { login } from "./api"
import { createEffect, useContext } from "solid-js";
import { ThemeContext } from "../../context/theme";
import { user, setUser } from "../../context/auth";

const Login = () => {
  const theme = useContext(ThemeContext);

  createEffect(() => {
    console.log("ggs", theme)
    console.log(user())
  })


  const form = createForm(() => ({
    defaultValues: {
      name: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      await login(value)
    },
  }))

  return (
    <>
      <button onClick={() => setUser({
        id: "ggs0",
        email: "ggs1",
        name: "ggs2",
        avatar: "ggs3"
      })}>
        here
      </button>
      <form
        method="post"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <form.Field
          name="name"
          children={(field) => (
            <input
              placeholder="name"
              name={field().name}
              value={field().state.value}
              onBlur={field().handleBlur}
              onInput={(e) => field().handleChange(e.target.value)}
            />
          )}
        />
        <form.Field
          name="password"
          children={(field) => (
            <input
              placeholder="password"
              name={field().name}
              value={field().state.value}
              onBlur={field().handleBlur}
              onInput={(e) => field().handleChange(e.target.value)}
            />
          )}
        />
        <button>
          login
        </button>
      </form>
    </>
  )
}

export default Login
