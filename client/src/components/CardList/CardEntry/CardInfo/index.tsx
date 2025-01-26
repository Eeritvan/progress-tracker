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
    <div className='grid grid-cols-2 grid-rows-2 gap-1'>
      <div className='flex justify-center items-center row-span-2 bg-iconbg
        aspect-square rounded-xl h-14'
      >
        <IconComponent size={24} />
      </div>
      <>
        {name}
      </>
      <div className='col-start-2'>
        {desc}
      </div>
    </div>
  )
}

export default CardInfo
