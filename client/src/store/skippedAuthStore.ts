import { create } from 'zustand'

interface CardListState {
  skipped: boolean
  setSkip: () => void
  resetSkip: () => void
}

const useSkipSlice = create<CardListState>((set) => ({
  skipped: false,
  setSkip: () => set({ skipped: true }),
  resetSkip: () => set({ skipped: false })
}))

export default useSkipSlice
