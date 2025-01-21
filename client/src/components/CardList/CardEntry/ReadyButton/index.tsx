import { Check } from 'lucide-react'
import useCardListSlice from '../../../../store/cardListStore'

const ReadyButton = () => {
  const completeDay = useCardListSlice((state) => state.completeDay)

  return (
    <button
      className='flex items-center justify-center bg-blue-400 h-14
        rounded-xl aspect-square hover:bg-blue-600'
      onClick={() => completeDay()}
    >
      <Check />
    </button>
  )
}

export default ReadyButton
