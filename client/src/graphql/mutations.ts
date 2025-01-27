import { Graffle } from 'graffle'

const graffle = Graffle
  .create({ output: { envelope: { errors: { execution: true } } } })
  .transport({ url: 'http://localhost:8080/query' })

export const loginMutation = graffle.gql(`
  mutation Login($username: String!, $password: String!, $totp: String) {
    login(input: {
      username: $username,
      password: $password,
      totp: $totp 
    }) {
      username
      token
    }
  }`
)

export const registerMutation = graffle.gql(`
  mutation createUser($username: String!, $password: String!) {
    createUser(input: {
      username: $username,
      password: $password,
    }) {
      username
      token
    }
  }`
)
