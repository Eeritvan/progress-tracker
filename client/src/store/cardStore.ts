import { create } from 'zustand'

export interface Card {
  id: number
  name: string
  desc?: string
}

const useCardsSlice = create((set) => ({
  cards: [],
  setCardsOrder: (cards: Card[]) => set({ cards }),
  addNewCard: (card: Card) =>
    set((state) => ({
      cards: [card, ...state.cards]
    })),
  resetCards: () => set(() => ({ cards: [] }))
}))

export default useCardsSlice
