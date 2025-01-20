import { useCallback } from 'react'
import CardEntry from './CardEntry'
import useCardsSlice, { Card } from '../store/cardStore'
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

const CardList = () => {
  const cards = useCardsSlice((state) => state.cards)
  const setCardsOrder = useCardsSlice((state) => state.setCardsOrder)

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
      const oldIndex = cards.findIndex((card: Card) => card.id === active.id)
      const newIndex = cards.findIndex((card: Card) => card.id === over.id)
      const newCards = arrayMove(cards, oldIndex, newIndex)
      setCardsOrder(newCards)
    }
  }, [cards, setCardsOrder])

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
      <SortableContext
        items={cards}
        strategy={verticalListSortingStrategy}
      >
        {cards.map((card: Card) => (
          <CardEntry key={card.id} id={card.id} name={card.name}/>
        ))}
      </SortableContext>
    </DndContext>
  )
}

export default CardList
