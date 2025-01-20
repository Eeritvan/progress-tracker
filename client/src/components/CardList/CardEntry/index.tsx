import ReadyButton from './ReadyButton'
import CardInfo from './CardInfo'
import SingleDay from './SingleDay'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const CardEntry = ({ id, name }: { id: string; name: string }) => {
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
      <div className='grid grid-cols-26 grid-rows-7 gap-1 grid-flow-col'>
        {generateDates().map((date, i) => (
          <SingleDay key={i} date={date}/>
        ))}
      </div>
    </div>
  )
}

export default CardEntry
