import { createEffect } from "solid-js";
import AboutData from "./data";
import { createForm } from "@tanstack/solid-form";
import { API_URL } from "../../lib/constants";
import { action, useAction } from "@solidjs/router";
// import { addTracker } from "./api";

export const addTracker = action(async (body: any) => {
  const response = await fetch(`${API_URL}/trackers/new`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error('ggs');
  }

  return response.json();
}, 'trackers');

const Trackers = () => {
  const testng = AboutData();
  const addNew = useAction(addTracker)

  createEffect(() => {
    console.log(testng());
  });

  const form = createForm(() => ({
    defaultValues: {
      title: '',
      description: '',
    },
    onSubmit: async ({ value }) => {
      await addNew(value)
    },
  }))

  return (
    <div>
      trackers
      <form
        method="post"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <form.Field
          name="title"
          children={(field) => (
            <input
              placeholder="title"
              name={field().name}
              value={field().state.value}
              onBlur={field().handleBlur}
              onInput={(e) => field().handleChange(e.target.value)}
            />
          )}
        />
        <form.Field
          name="description"
          children={(field) => (
            <input
              placeholder="desc"
              name={field().name}
              value={field().state.value}
              onBlur={field().handleBlur}
              onInput={(e) => field().handleChange(e.target.value)}
            />
          )}
        />
        <button>
          add new
        </button>
      </form>
    </div>
  )
}

export default Trackers
