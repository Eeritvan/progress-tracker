import { Graffle } from 'graffle'

const graffle = Graffle
  .create({ output: { envelope: { errors: { execution: true } } } })
  .transport({ url: 'http://localhost:8081/query' })

export const createCardMutation = graffle.gql(`
  mutation GetCards() {
    getCards {
      id
      name
      desc
      completedDays
      color
      icon
    }
  }`
)
