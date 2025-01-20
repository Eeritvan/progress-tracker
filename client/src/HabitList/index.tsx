import { useCallback, useState } from 'react'
import HabitEntry from './HabitEntry'
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {
  restrictToVerticalAxis,
  restrictToParentElement
} from '@dnd-kit/modifiers'
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates
} from '@dnd-kit/sortable'

const HabitList = () => {
  const [habits, setHabits] = useState([
    { id: 1, name: 'put the fries in the bag' },
    { id: 2, name: 'start dropshipping' },
    { id: 3, name: 'yolo lifesavings into memecoins' }
  ])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5
      }
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setHabits((events) => {
        const oldIndex = events.findIndex(item => item.id === active.id)
        const newIndex = events.findIndex(item => item.id === over.id)
        return arrayMove(events, oldIndex, newIndex)
      })
    }
  }, [])

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
      <SortableContext
        items={habits}
        strategy={verticalListSortingStrategy}
      >
        {habits.map((entry) => (
          <HabitEntry key={entry.id} id={entry.id} name={entry.name}/>
        ))}
      </SortableContext>
    </DndContext>
  )
}

export default HabitList
