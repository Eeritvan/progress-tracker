import { Graffle } from 'graffle'

const getAuthToken = (): string => {
  const userInfo = window.localStorage.getItem('user-info')
  if (!userInfo) return ''

  const parsed = JSON.parse(userInfo)
  return parsed.token || ''
}

const usersGraffle = Graffle
  .create({ output: { envelope: { errors: { execution: true } } } })
  .transport({ url: import.meta.env.VITE_USERS_SVC || '/users/query' })

const dataGraffle = Graffle
  .create({ output: { envelope: { errors: { execution: true } } } })
  .transport({ url: import.meta.env.VITE_DATA_SVC || '/data/query' })
  .anyware(({ pack }) => {
    return pack({
      input: {
        ...pack.input,
        headers: {
          authorization: `Bearer ${getAuthToken()}`
        }
      }
    })
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
  mutation CreateCard(
    $title: String!,
    $desc: String!,
    $color: Color!,
    $icon: Icon!
  ) {
    createCard(input: {
      title: $title,
      desc: $desc,
      color: $color,
      icon: $icon,
    }) {
      id
      title
      desc
      completedDays
      color
      icon
    }
  }`
)

export const deleteCardMutation = dataGraffle.gql(`
  mutation DeleteCard($id: ID!) {
    deleteCard(input: $id)
  }`
)

export const completeDayMutation = dataGraffle.gql(`
  mutation CompleteDay($id: ID!) {
    completeDay(input: $id)
  }`
)

export const reorderCardsMutation = dataGraffle.gql(`
  mutation ReorderCards($input: [ID!]!) {
    reorderCards(input: $input)
  }
`)

export const resetAllCardsMutation = dataGraffle.gql(`
  mutation ResetAllCards {
    resetAllCards
  }
`)
