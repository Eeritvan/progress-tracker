import { createForm } from "@tanstack/solid-form"
import { login } from "./api"

const Login = () => {
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
  )
}

export default Login
