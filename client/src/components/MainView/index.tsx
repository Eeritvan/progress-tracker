import { useQuery } from '@tanstack/react-query'
import CardList from './CardList'
import TopBar from './TopBar'
import { getCardsQuery } from '@/graphql/queries'
import useCardListSlice, { Card } from '@/store/cardListStore'

const MainView = () => {
  const setCards = useCardListSlice((state) => state.setCardsOrder)
  useQuery({
    queryKey: ['cards'],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const result = await getCardsQuery.send()
      const data = result.data?.getCards
      const cards: Card[] = data.map((x: any) => ({
        id: x.id,
        name: x.name,
        desc: x.desc,
        completedDays: new Set<string>(x.completedDays),
        color: x.color,
        icon: x.icon
      }))
      setCards(cards)
      return cards
    }
  })

  return (
    <div className='container w-[600px]'>
      <TopBar />
      <CardList />
    </div>
  )
}

export default MainView
