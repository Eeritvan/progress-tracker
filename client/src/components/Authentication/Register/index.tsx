import { SubmitHandler, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { registerMutation } from '@/graphql/mutations'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import FormField from '../shared/FormField'
import Button from '../shared/Button'
import {
  object,
  pipe,
  string,
  minLength,
  nonEmpty,
  InferInput,
  forward,
  partialCheck
} from 'valibot'

const registerSchema = pipe(
  object({
    username: pipe(
      string('username is required'),
      minLength(3, 'Needs to be at least 3 characters')
    ),
    password: pipe(
      string('password must be a string'),
      nonEmpty('password cant be empty'),
      minLength(8, 'the password must be at least 8 characters long')
    ),
    passwordConfirm: string()
  }),
  forward(
    partialCheck(
      [['password'], ['passwordConfirm']],
      (input) => input.password === input.passwordConfirm,
      'The two passwords do not match.'
    ),
    ['passwordConfirm']
  )
)

type FormData = InferInput<typeof registerSchema>

const Register = () => {
  const queryClient = useQueryClient()
  const { setItem } = useLocalStorage('user-info')

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: valibotResolver(registerSchema)
  })

  const registerMutate = useMutation({
    mutationFn: async (data: FormData) => {
      const result = await registerMutation
        .send({
          username: data.username,
          password: data.password
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
      await registerMutate.mutateAsync(data)
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
      <FormField
        type = 'password'
        error = {errors.passwordConfirm?.message}
        register = {register}
        name = 'passwordConfirm'
        placeholder = 'confirm password'
      />
      <Button
        isSubmitting = {isSubmitting}
        error = {errors.root?.message}
      />
    </form>
  )
}

export default Register
