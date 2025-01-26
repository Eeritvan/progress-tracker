import { create } from 'zustand'
import { COLORS, ICONS } from '../utils/constants'

export interface Card {
  id: number
  name: string
  desc?: string
  completedDays: Set<string>
  color: (typeof COLORS)[number]
  icon: (typeof ICONS)[number]
}

interface CardListState {
  cards: Card[]
  setCardsOrder: (cards: Card[]) => void
  addNewCard: (card: Card) => void
  deleteCard: (id: number) => void
  toggleDay: (id: number) => void
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
  toggleDay: (id: number) =>
    set((state) => ({
      cards: state.cards.map(card => {
        if (card.id !== id) return card

        const today = new Date().toISOString().split('T')[0]
        const completedDays = new Set(card.completedDays)

        if (completedDays.has(today)) {
          completedDays.delete(today)
        } else {
          completedDays.add(today)
        }

        return {
          ...card,
          completedDays
        }
      })
    })),
  resetCards: () => set(() => ({ cards: [] }))
}))

export default useCardListSlice
