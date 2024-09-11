import { create } from 'zustand'
import { persist } from 'zustand/middleware'
export const useStore = create(
  persist(
    (set) => ({
      run: null,
      rol: null,
      name: null,
      lastName: null,
      idUsuario: null,
      empresa: null,
      email: null,
      nombreEmpresa: null,

      setRun: (newRun) => set({ run: newRun }),
      setRol: (newRol) => set({ rol: newRol }),
      setName: (newName) => set({ name: newName }),
      setLastName: (newName) => set({ lastName: newName }),
      setEmpresa: (newName) => set({ empresa: newName }),
      setNombreEmpresa: (newName) => set({ nombreEmpresa: newName }),
      setEmail: (newName) => set({ email: newName }),
      setIdUsuario: (newIdUsuario) => set({ idUsuario: newIdUsuario })
    }),
    {
      name: 'userData'
    }
  )
)
