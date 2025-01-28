import { Graffle } from 'graffle'

const usersGraffle = Graffle
  .create({ output: { envelope: { errors: { execution: true } } } })
  .transport({ url: import.meta.env.VITE_USERS_SVC })

const dataGraffle = Graffle
  .create({ output: { envelope: { errors: { execution: true } } } })
  .transport({
    url: import.meta.env.VITE_DATA_SVC,
    headers: {
      authorization: `Bearer ${JSON.parse(window.localStorage.getItem('user-info')).token}`
    }
  })

export const loginMutation = usersGraffle.gql(`
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

export const registerMutation = usersGraffle.gql(`
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

export const createCardMutation = dataGraffle.gql(`
  mutation CreateCard($name: String!, $desc: String!, $color: Color!, $icon: Icon!) {
    createCard(input: {
      name: $name,
      desc: $desc,
      color: $color,
      icon: $icon,
    }) {
      id
      name
      desc
      completedDays
      color
      icon
    }
  }`
)
