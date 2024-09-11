import { Box, Button, Container, Paper, Typography } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Checkbox from '@mui/material/Checkbox'

export const Box3 = ({ data, isCheckbox1Checked, handleCheckbox1Change, isCheckbox2Checked, handleCheckbox2Change, handleBack, handleInfoCandidato }) => {
  const instrumento1 = data[0].infoInstrumento?.codInstrumento1
  const instrumento2 = data[0].infoInstrumento?.codInstrumento2
  return (
    <Container maxWidth='xl'>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <Typography variant='h4' sx={{ fontWeight: 'bold', color: '#d00000' }}>
          Términos y condiciones
        </Typography>
      </Box>

      {/* Instrumento 1 */}
      {instrumento1 && (
        <Box component={Paper} sx={{ padding: 2, marginTop: 10, width: '100%', display: 'flex', flexDirection: 'column' }}>
          <Typography variant='h4' sx={{ fontSize: 25, color: '#d00000', marginBottom: 2 }}>
            <span style={{ fontWeight: 'bold' }}>
              {instrumento1 === 'ECT' ? 'Declaración jurada simple' : 'Declaración EP'}
            </span>
          </Typography>
          <Typography variant='h6' sx={{ textAlign: 'justify', fontSize: 17 }}>
            {instrumento1 === 'ECT'
              ? 'Declaro mi voluntad de ser evaluado(a) en el instrumento asociado a identificar mi nivel de conocimiento asociado a la Ley 21.643 (Ley Karin) y luego entregar esta información a mi empleador.'
              : 'Declaro mi voluntad de querer participar en la Encuesta de Percepción de la Ley 21.643 (Ley Karin) y luego entregar esta información a mi empleador.'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: -1.5 }}>
            <Checkbox color='error' checked={instrumento1 === 'ECT' ? isCheckbox1Checked : isCheckbox2Checked} onChange={instrumento1 === 'ECT' ? handleCheckbox1Change : handleCheckbox2Change} />
            <Typography sx={{ color: 'gray' }}> Acepto los términos y condiciones </Typography>
          </Box>
        </Box>
      )}

      {/* Instrumento 2 */}
      {instrumento2 && (
        <Box component={Paper} sx={{ padding: 2, marginTop: 5, width: '100%', display: 'flex', flexDirection: 'column' }}>
          <Typography variant='h4' sx={{ fontSize: 25 }}>
            <span style={{ fontWeight: 'bold', color: '#d00000', marginBottom: 2 }}>
              {instrumento2 === 'ECT' ? 'Declaración jurada simple' : 'Declaración EP'}
            </span>
          </Typography>
          <Typography variant='h6' sx={{ textAlign: 'justify', fontSize: 17 }}>
            {instrumento2 === 'ECT'
              ? 'Declaro mi voluntad de ser evaluado(a) en el instrumento asociado a identificar mi nivel de conocimiento asociado a la Ley 21.643 (Ley Karin) y luego entregar esta información a mi empleador.'
              : 'Declaro mi voluntad de querer participar en la Encuesta de Percepción de la Ley 21.643 (Ley Karin) y luego entregar esta información a mi empleador.'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: -1.5 }}>
            <Checkbox color='error' checked={instrumento2 === 'ECT' ? isCheckbox1Checked : isCheckbox2Checked} onChange={instrumento2 === 'ECT' ? handleCheckbox1Change : handleCheckbox2Change} />
            <Typography sx={{ color: 'gray' }}> Acepto los términos y condiciones </Typography>
          </Box>
        </Box>
      )}

      <Box sx={{ top: 'auto', bottom: 0, marginTop: 2, display: 'flex', flexDirection: 'row', gap: 2, mb: { xs: 10 } }}>
        <Button variant='contained' size='large' color='error' sx={{ fontWeight: 'bold' }} onClick={handleBack} startIcon={<ArrowBackIcon />}>
          Atrás
        </Button>
        <Button variant='contained' size='large' color='error' sx={{ fontWeight: 'bold' }} onClick={handleInfoCandidato} endIcon={<ArrowForwardIcon />}>
          Continuar
        </Button>
      </Box>
    </Container>
  )
}
