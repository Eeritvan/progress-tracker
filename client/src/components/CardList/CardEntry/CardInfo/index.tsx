import { Book, Code, TentTree, School } from 'lucide-react'
import { Card } from '../../../../store/cardListStore'

const iconComponents = {
  'Book': Book,
  'Code': Code,
  'TentTree': TentTree,
  'School': School
}

type CardInfoProps = Omit<Card, 'id' | 'completedDays' | 'color'>

const CardInfo = ({ icon, name, desc }: CardInfoProps) => {
  const IconComponent = iconComponents[icon]

  return (
    <div className='grid grid-cols-2 grid-rows-2 gap-1'>
      <div className='flex justify-center items-center row-span-2 bg-amber-600
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
