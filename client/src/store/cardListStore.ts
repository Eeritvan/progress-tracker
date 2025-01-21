import { create } from 'zustand'

export interface Card {
  id: number
  name: string
  desc?: string
  completedDays: Date[]
  color: 'blue' | 'red' | 'green'
  icon: undefined
}

interface CardListState {
  cards: Card[]
  setCardsOrder: (cards: Card[]) => void
  addNewCard: (card: Card) => void
  deleteCard: (id: number) => void
  completeDay: () => void
  resetCards: () => void
}

const useCardListSlice = create<CardListState>((set) => ({
  cards: [],
  setCardsOrder: (cards: Card[]) => set({ cards }),
  addNewCard: (card: Card) =>
    set((state) => ({
      cards: [card, ...state.cards]
    })),
  deleteCard: (id: number) =>
    set((state) => ({
      cards: state.cards.filter((card) => card.id !== id)
    })),
  completeDay: () =>
    set((state) => ({
      cards: state.cards.map(card => ({
        ...card,
        completedDays: [...card.completedDays, new Date()]
      }))
    })),
  resetCards: () => set(() => ({ cards: [] }))
}))

export default useCardListSlice
