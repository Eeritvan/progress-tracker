import {
  Book,
  Code,
  TentTree,
  School,
  AlarmClock,
  Brush,
  CalendarDays,
  Gamepad2,
  NotebookPen,
  Coffee,
  Wallet
} from 'lucide-react'
import { Card } from '@/store/cardListStore'

const iconComponents = {
  'Book': Book,
  'Code': Code,
  'TentTree': TentTree,
  'School': School,
  'AlarmClock': AlarmClock,
  'Brush': Brush,
  'CalendarDays': CalendarDays,
  'Gamepad2': Gamepad2,
  'NotebookPen': NotebookPen,
  'Coffee': Coffee,
  'Wallet': Wallet
}

type CardInfoProps = Omit<Card, 'id' | 'completedDays' | 'color'>

const CardInfo = ({ icon, name, desc }: CardInfoProps) => {
  const IconComponent = iconComponents[icon]

  return (
    <div className='flex gap-x-2 flex-1 min-w-0'>
      <div className='flex justify-center items-center row-span-2 bg-iconbg
        aspect-square rounded-xl h-14 shrink-0'
      >
        <IconComponent size={24} />
      </div>
      <div className='flex flex-col justify-center min-w-0'>
        <div className='font-medium truncate'> {name} </div>
        {desc && <div className='truncate'> {desc} </div>}
      </div>
    </div>
  )
}

export default CardInfo
