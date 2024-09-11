import { jwtDecode } from 'jwt-decode'
import { useStore } from '../Store/StoreUser'

export const isTokenValid = () => {
  const token = window.localStorage.getItem('token')
  if (!token) return false

  try {
    const decodedToken = jwtDecode(token)
    const currentTime = Math.floor(Date.now() / 1000)
    useStore.getState().setRun(decodedToken.Run)
    useStore.getState().setRol(decodedToken.role)
    useStore.getState().setName(decodedToken.Nombre)
    useStore.getState().setLastName(decodedToken.Apellido)
    useStore.getState().setIdUsuario(decodedToken.IdUsuario)
    useStore.getState().setEmpresa(decodedToken.IdEmpresa)
    useStore.getState().setNombreEmpresa(decodedToken.NombreEmpresa)
    useStore.getState().setEmail(decodedToken.Email)
    return decodedToken.exp > currentTime
  } catch (error) {
    window.localStorage.clear()
    return false
  }
}
