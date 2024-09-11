import { Box, Button, Container, Paper, Typography } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const renderInstrumentContent = (instrument, data) => {
  if (instrument === 'ECT' && data[0].infoProcesoDigitado?.flgAceptaTerminosPctProcesoDigitado) {
    return (
      <Box component={Paper} sx={{ padding: 2, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ textAlign: 'center', marginBottom: 2 }}>
          <Typography variant='h4' sx={{ fontSize: 25 }}>
            <span style={{ fontWeight: 'bold', color: '#d00000' }}>Evaluación conocimiento teórico</span>
          </Typography>
        </Box>
        <Typography variant='h6' sx={{ textAlign: 'justify', fontSize: 17 }}>
          La aplicación de esta evaluación de conocimientos teóricos (ECT), permitirá obtener información relevante acerca de sus
          conocimientos de la Ley 21.643 (Ley Karin). Dicha información será el insumo para hacer un diagnóstico cuyo objetivo
          es orientar las actividades de capacitación en el lugar de trabajo y dar cumplimiento a lo estipulado en la Ley.
        </Typography>
      </Box>
    )
  } else if (instrument === 'EP' && data[0].infoProcesoDigitado?.flgAceptaTerminosEpProcesoDigitado) {
    return (
      <Box component={Paper} sx={{ padding: 2, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ textAlign: 'center', marginBottom: 2 }}>
          <Typography variant='h4' sx={{ fontSize: 25 }}>
            <span style={{ fontWeight: 'bold', color: '#d00000' }}>Encuesta de percepción</span>
          </Typography>
        </Box>
        <Typography variant='h6' sx={{ textAlign: 'justify', fontSize: 17 }}>
          La aplicación de esta Encuesta de percepción, permitirá obtener información relevante acerca de su apreciación respecto a los procedimientos y
          actividades que ha implementado su empresa en el contexto de la Ley 21.643 sobre prevención, investigación y sanción del acoso laboral,
          sexual o de violencia en el trabajo. Por lo tanto no hay respuestas buenas o malas.
        </Typography>
      </Box>
    )
  }
  return null
}

export const Box2 = ({ data, handleBackInfo, handleSiguienteTerminos, dateNew }) => {
  const { codInstrumento1, codInstrumento2 } = data[0].infoInstrumento || {}
  return (
    <Container maxWidth='xl'>
      <Box sx={{ display: 'flex', marginBottom: 5, justifyContent: 'center' }}>
        <Typography variant='h4' sx={{ fontWeight: 'bold', color: '#d00000' }}>Introducción</Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {codInstrumento1 && renderInstrumentContent(codInstrumento1, data)}
        {codInstrumento2 && renderInstrumentContent(codInstrumento2, data)}
      </Box>

      <Box sx={{ top: 'auto', bottom: 0, marginTop: 2, display: 'flex', flexDirection: 'row', gap: 2, mb: { xs: 10 } }}>
        <Button variant='contained' size='large' color='error' sx={{ fontWeight: 'bold' }} onClick={handleBackInfo} startIcon={<ArrowBackIcon />}>
          Atrás
        </Button>
        <Button variant='contained' size='large' color='error' sx={{ fontWeight: 'bold' }} onClick={handleSiguienteTerminos} endIcon={<ArrowForwardIcon />}>
          Continuar
        </Button>
      </Box>
    </Container>
  )
}
