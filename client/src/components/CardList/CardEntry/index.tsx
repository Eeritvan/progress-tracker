import ReadyButton from './ReadyButton'
import CardInfo from './CardInfo'
import SingleDay from './SingleDay'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const CardEntry = ({ id, name }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id })

  const style = {
    transition,
    transform: CSS.Transform.toString(transform)
  }

  return (
    <div
      className='w-[600px] bg-red-300 rounded-xl p-2'
      ref={ setNodeRef }
      {...attributes}
      {...listeners}
      style={style}
    >
      <div className='flex justify-between items-center mb-2'>
        <CardInfo name={ name }/>
        <ReadyButton />
      </div>
      <div className='grid grid-cols-26 grid-rows-7 gap-1'>
        {[...Array(182)].map((_, i) => (
          <SingleDay key={i}/>
        ))}
      </div>
    </div>
  )
}

export default CardEntry
