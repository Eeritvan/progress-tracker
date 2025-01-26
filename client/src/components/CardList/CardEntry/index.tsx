import ReadyButton from './ReadyButton'
import CardInfo from './CardInfo'
import SingleDay from './SingleDay'
import { Card } from '../../../store/cardListStore'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { generateDates } from '../../../utils/generateDays'
import ControlMenu from './ControlMenu'
import { useState } from 'react'

const CardEntry = ({ id, name, desc, completedDays, color, icon }: Card) => {
  const [isOpen, setOpen] = useState(false)
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 })
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
      className='w-[600px] bg-gray-300 rounded-xl p-2'
      ref={ setNodeRef }
      {...attributes}
      {...listeners}
      style={style}
      onContextMenu={(e) => {
        if (typeof document.hasFocus === 'function' && !document.hasFocus()) {
          return
        }
        e.preventDefault()
        setAnchorPoint({ x: e.clientX, y: e.clientY })
        setOpen(true)
      }}
    >
      <div className='flex justify-between items-center mb-2'>
        <CardInfo icon={icon} name={name} desc={desc} />
        <ReadyButton id={id} color={color} />
      </div>
      <div className='grid grid-cols-26 grid-rows-7 gap-1 grid-flow-col'>
        {generateDates().map((date, index) => (
          <SingleDay
            key={index}
            date={date}
            color={color}
            completed={completedDays.has(date)}
          />
        ))}
      </div>
      <ControlMenu
        id={id}
        isOpen={isOpen}
        setOpen={setOpen}
        anchorPoint={anchorPoint}
      />
    </div>
  )
}

export default CardEntry
