import { Check } from 'lucide-react'
import useCardListSlice from '../../../../store/cardListStore'
import { COLORS } from '../../../../utils/constants'

const ReadyButton = (
  { id, color }: { id: number, color: (typeof COLORS)[number] }
) => {
  const toggleDay = useCardListSlice((state) => state.toggleDay)

  return (
    <button
      className='flex items-center justify-center bg-blue-400 h-14 rounded-xl
        aspect-square hover:bg-blue-600'
      style={{ backgroundColor: color }}
      onClick={() => toggleDay(id)}
    >
      <Check />
    </button>
  )
}

export default ReadyButton
