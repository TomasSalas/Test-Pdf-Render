import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Login } from './Pages/Login'
import { GestionUsuario } from './Pages/Moderador/GestionUsuario'
import { GestionCliente } from './Pages/Comercial/GestionCliente'
import { GestionMutuarias } from './Pages/Comercial/GestionMutuarias'
import { GestionSucursal } from './Pages/Comercial/GestionSucursal'
import { GestionPerfiles } from './Pages/Instrumentos/GestionPerfiles'
import { GestionUcls } from './Pages/Instrumentos/GestionUcls'
import { GestionRelacion } from './Pages/Instrumentos/GestionRelacion'
import { GestionInstrumentos } from './Pages/Instrumentos/GestionInstrumentos'
import { GestionActividad } from './Pages/Instrumentos/GestionActividad'
import { GestionCriterio } from './Pages/Instrumentos/GestionCriterio'
import { GestionDetalleInstrumento } from './Pages/Instrumentos/GestionDetalleInstrumento'
import { Resumen } from './Pages/Candidato/Resumen'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { Contrato } from './Pages/Comercial/Contratos'
import { DetalleContrato } from './Pages/Comercial/DetalleContrato'
import { Planificar } from './Pages/Moderador/Planificar'
import { VerPlanificacion } from './Pages/Moderador/VerPlanificacion'
import { AuditoriaInstrumentos } from './Pages/Instrumentos/AuditoriaInstrumentos'
import { Rendir } from './Pages/Candidato/Rendir'
import { Informe } from './Pages/Candidato/Informe'

export const App = () => {
  const theme = createTheme({
    typography: {
      fontFamily: 'Open Sans'
    }
  })

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/usuarios' element={<GestionUsuario />} />
          <Route path='/clientes' element={<GestionCliente />} />
          <Route path='/mutuarias' element={<GestionMutuarias />} />
          <Route path='/sucursal' element={<GestionSucursal />} />
          <Route path='/perfiles' element={<GestionPerfiles />} />
          <Route path='/ucls' element={<GestionUcls />} />
          <Route path='/perfil-ucls' element={<GestionRelacion />} />
          <Route path='/instrumentos' element={<GestionInstrumentos />} />
          <Route path='/actividad' element={<GestionActividad />} />
          <Route path='/criterio' element={<GestionCriterio />} />
          <Route path='/detalle-instrumento' element={<GestionDetalleInstrumento />} />
          <Route path='/auditoria-instrumento' element={<AuditoriaInstrumentos />} />
          <Route path='/resumen' element={<Resumen />} />
          <Route path='/contrato' element={<Contrato />} />
          <Route path='/detalle-contrato' element={<DetalleContrato />} />
          <Route path='/planificar' element={<Planificar />} />
          <Route path='/ver-planificacion' element={<VerPlanificacion />} />
          <Route path='/rendir' element={<Rendir />} />
          <Route path='/informe' element={<Informe />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
