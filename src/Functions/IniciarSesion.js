import { jwtDecode } from 'jwt-decode'
import { useStore } from '../Store/StoreUser'
import { UrlBase } from '../Helpers/Rutas'

export const IniciarSesion = async (data) => {
  const { run, contrasena } = data

  const params = {
    run: run.replace('-', '').replace(/\./g, ''),
    contrasena
  }

  try {
    const token = window.localStorage.getItem('token')
    const auth = `Bearer ${token}`

    const response = await fetch(UrlBase + 'login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: auth
      },
      body: JSON.stringify(params)
    })

    const { isExitoso, resultado, errorMessages, mensajeExitoso } = await response.json()

    if (isExitoso) {
      const { token } = resultado
      const decodedToken = jwtDecode(token)

      window.localStorage.setItem('token', token)
      useStore.getState().setRun(decodedToken.Run)
      useStore.getState().setRol(decodedToken.role)
      useStore.getState().setName(decodedToken.Nombre)
      useStore.getState().setLastName(decodedToken.Apellido)
      useStore.getState().setIdUsuario(decodedToken.IdUsuario)
      useStore.getState().setEmpresa(decodedToken.IdEmpresa)
      useStore.getState().setNombreEmpresa(decodedToken.NombreEmpresa)
      useStore.getState().setEmail(decodedToken.Email)

      return {
        success: true,
        message: mensajeExitoso,
        result: decodedToken.role
      }
    } else {
      return {
        success: false,
        message: errorMessages.join(', '),
        result: null
      }
    }
  } catch (error) {
    return {
      success: false,
      message: 'Error during login, please try again later.' + error
    }
  }
}
