import { create } from 'zustand'

export const useStore = create((set) => ({
  isDrawerOpen: true,
  setDrawerOpen: (isOpen) => set({ isDrawerOpen: isOpen })
}))
