import { create } from 'zustand'

export interface Card {
  id: number
  name: string
  desc?: string
}

const useCardListSlice = create((set) => ({
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
  resetCards: () => set(() => ({ cards: [] }))
}))

export default useCardListSlice
