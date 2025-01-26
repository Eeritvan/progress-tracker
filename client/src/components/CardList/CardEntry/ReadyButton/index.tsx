import { Check } from 'lucide-react'
import useCardListSlice from '../../../../store/cardListStore'
import { COLORS } from '../../../../utils/constants'

const ReadyButton = (
  { id, color }: { id: number, color: (typeof COLORS)[number] }
) => {
  const toggleDay = useCardListSlice((state) => state.toggleDay)

  return (
    <button
      className='flex items-center justify-center h-14 rounded-xl aspect-square'
      style={{ backgroundColor: color }}
      onClick={() => toggleDay(id)}
    >
      <Check />
    </button>
  )
}

export default ReadyButton
