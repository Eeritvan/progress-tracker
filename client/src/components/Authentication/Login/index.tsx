import { SubmitHandler, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { loginMutation } from '@/graphql/mutations'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import FormField from '../shared/FormField'
import Button from '../shared/Button'
import {
  object,
  pipe,
  string,
  minLength,
  number,
  optional,
  maxValue,
  minValue,
  InferInput
} from 'valibot'

const loginSchema = object({
  username: pipe(
    string('username is required'),
    minLength(3, 'Needs to be at least 3 characters')
  ),
  password: pipe(
    string('password is required')
  ),
  totp: optional(pipe(
    number('must be a number'),
    minValue(0, 'incorrect totp format'),
    maxValue(999999, 'incorrect totp format')
  ))
})

type FormData = InferInput<typeof loginSchema>

const Login = () => {
  const queryClient = useQueryClient()
  const { setItem } = useLocalStorage('user-info')

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: valibotResolver(loginSchema)
  })

  const loginMutate = useMutation({
    mutationFn: async (data: FormData) => {
      const result = await loginMutation
        .send({
          username: data.username,
          password: data.password,
          totp: data.totp ? data.totp : null
        })
      if (result.errors) throw result.errors[0].message
      const userData = result.data?.login
      setItem(userData)
      return userData
    },
    onError: (e) => { throw e },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['token'] })
  })

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      await loginMutate.mutateAsync(data)
    } catch (error) {
      setError('root', { message: error as unknown as string })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormField
        type = 'text'
        error = {errors.username?.message}
        register = {register}
        name = 'username'
        placeholder = 'username'
      />
      <FormField
        type = 'password'
        error = {errors.password?.message}
        register = {register}
        name = 'password'
        placeholder = 'password'
      />
      <Button
        isSubmitting = {isSubmitting}
        error = {errors.root?.message}
      />
    </form>
  )
}

export default Login
