import { Graffle } from 'graffle'

const dataGraffle = Graffle
  .create({ output: { envelope: { errors: { execution: true } } } })
  .transport({
    url: import.meta.env.VITE_DATA_SVC,
    headers: {
      authorization:
        `Bearer ${JSON.parse(window.localStorage.getItem('user-info')).token}`
    }
  })

export const getCardsQuery = dataGraffle.gql(`
  query GetCards {
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
