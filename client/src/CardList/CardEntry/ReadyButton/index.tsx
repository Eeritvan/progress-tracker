import { Check } from 'lucide-react'

const ReadyButton = () => {
  return (
    <button
      className='flex items-center justify-center bg-blue-400 h-14
        rounded-xl aspect-square hover:bg-blue-600'
      onClick={() => console.log('clicked')}
    >
      <Check />
    </button>
  )
}

export default ReadyButton
