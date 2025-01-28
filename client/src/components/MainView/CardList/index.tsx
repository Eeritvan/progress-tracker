import CardEntry from './CardEntry'
import useCardListSlice, { Card } from '@/store/cardListStore'
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
import { useMutation } from '@tanstack/react-query'
import { reorderCardsMutation } from '@/graphql/mutations'

const CardList = () => {
  const cards = useCardListSlice((state) => state.cards)
  const setCardsOrder = useCardListSlice((state) => state.setCardsOrder)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5
      }
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const reorderMutation = useMutation({
    mutationFn: async (cardIds: number[]) => {
      const result = await reorderCardsMutation.send({ input: cardIds })
      if (result.errors) throw result.errors[0].message
      return result.data?.reorderCards
    }
  })

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = cards.findIndex((card: Card) => card.id === active.id)
      const newIndex = cards.findIndex((card: Card) => card.id === over.id)
      const newCards = arrayMove(cards, oldIndex, newIndex)
      setCardsOrder(newCards)
      reorderMutation.mutateAsync(newCards.map(card => Number(card.id)))
    }
  }

  return (
    <div>
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
            <CardEntry {...card} key={card.id} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  )
}

export default CardList
