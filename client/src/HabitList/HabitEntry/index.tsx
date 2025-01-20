// import ReadyButton from './ReadyButton'
// import HabitInfo from './HabitInfo'
import SingleDay from './SingleDay'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const HabitEntry = ({ id, name }) => {
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
      className='w-[600px] bg-red-300 m-4 rounded-xl p-4'
      ref={ setNodeRef }
      {...attributes}
      {...listeners}
      style={style}
    >
      {/* <ReadyButton />
      <HabitEntry /> */}
      { name }
      <div className='grid grid-cols-26 grid-rows-7 gap-1'>
        {[...Array(182)].map((_, i) => (
          <SingleDay key={i}/>
          // <div key={i} className='bg-white/30 aspect-square h-4' />
        ))}
      </div>
    </div>
  )
}

export default HabitEntry
