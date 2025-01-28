import { useQuery } from '@tanstack/react-query'
import CardList from './CardList'
import TopBar from './TopBar'
import { getCardsQuery } from '@/graphql/queries'
import useCardListSlice, { Card } from '@/store/cardListStore'

interface RawCardData {
  id: string;
  name: string;
  desc: string;
  completedDays: string[];
  color: string;
  icon: string;
}

const MainView = () => {
  const setCards = useCardListSlice((state) => state.setCardsOrder)
  useQuery({
    queryKey: ['cards'],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const result = await getCardsQuery.send()
      const data = result.data?.getCards
      const cards: Card[] = data.map((x: RawCardData) => ({
        ...x,
        completedDays: new Set<string>(x.completedDays)
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
