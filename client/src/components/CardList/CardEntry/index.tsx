/* eslint-disable react/jsx-no-bind */
import ReadyButton from './ReadyButton'
import CardInfo from './CardInfo'
import SingleDay from './SingleDay'
import useCardListSlice, { Card } from '../../../store/cardListStore'
import { ControlledMenu, MenuItem } from '@szhsin/react-menu'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'

const CardEntry = ({ id, name, completedDays, color, icon }: Card) => {
  const [isOpen, setOpen] = useState(false)
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 })
  const deleteCard = useCardListSlice((state) => state.deleteCard)

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

  const generateDates = () => {
    const dates = []
    const today = new Date()

    const startDate = new Date(today)
    const emptyDaysAtStart = (
      new Date(startDate.setDate(startDate.getDate() - 181)).getDay() + 6) % 7

    for (let i = 181-(7-emptyDaysAtStart); i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      dates.push(date)
    }

    for (let i = 1; i <= 7-emptyDaysAtStart; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push(date)
    }

    return dates
  }

  // console.log(generateDates())

  return (
    <div
      className='w-[600px] bg-red-300 rounded-xl p-2'
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
        <CardInfo name={ name }/>
        <ReadyButton />
      </div>
      <div className='grid grid-cols-26 grid-rows-7 gap-1 grid-flow-col'>
        {generateDates().map((date, i) => (
          <SingleDay
            key={i}
            date={date}
            completed={completedDays.some(completedDate =>
              completedDate.getFullYear() === date.getFullYear() &&
              completedDate.getMonth() === date.getMonth() &&
              completedDate.getDate() === date.getDate()
            )}
          />
        ))}
      </div>
      <ControlledMenu
        anchorPoint={anchorPoint}
        state={isOpen ? 'open' : 'closed'}
        direction="right"
        onClose={() => setOpen(false)}
      >
        <MenuItem onClick={() => deleteCard(id)}>Delete</MenuItem>
      </ControlledMenu>
    </div>
  )
}

export default CardEntry
