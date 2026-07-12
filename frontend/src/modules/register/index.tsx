import { createForm } from "@tanstack/solid-form"
import { register } from "./api"

const Register = () => {
  const form = createForm(() => ({
    defaultValues: {
      name: '',
      password: '',
      passwordConfirmation: '',
    },
    onSubmit: async ({ value }) => {
      await register(value)
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
      <form.Field
        name="passwordConfirmation"
        children={(field) => (
          <input
            placeholder="password confirmation"
            name={field().name}
            value={field().state.value}
            onBlur={field().handleBlur}
            onInput={(e) => field().handleChange(e.target.value)}
          />
        )}
      />
      <button>
        register
      </button>
    </form>
  )
}

export default Register
