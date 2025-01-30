import { Graffle } from 'graffle'

const getAuthToken = (): string => {
  const userInfo = window.localStorage.getItem('user-info')
  if (!userInfo) return ''

  const parsed = JSON.parse(userInfo)
  return parsed.token || ''
}

const dataGraffle = Graffle
  .create({ output: { envelope: { errors: { execution: true } } } })
  .transport({ url: import.meta.env.VITE_DATA_SVC })
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
