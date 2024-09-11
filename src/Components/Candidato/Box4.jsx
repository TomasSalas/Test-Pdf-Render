import { Container, Box, Typography, Card, CardMedia, CardContent, CardActions, Button } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ImgPct from '../../assets/PCT.png'
import ImgEP from '../../assets/EP.png'

export const Box4 = ({ data, rendirPrueba, handleBackCandidato }) => {
  return (
    <Container maxWidth='xl'>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <Typography variant='h4' sx={{ fontWeight: 'bold', color: '#d00000' }}>
          {(data[0].infoInstrumento?.codInstrumento1 === 'ECT' && data[0].infoInstrumento?.codInstrumento2 === 'EP') || (data[0].infoInstrumento?.codInstrumento1 === 'EP' && data[0].infoInstrumento?.codInstrumento2 === 'ECT')
            ? 'Rendir Evaluación y Encuesta'
            : data[0].infoInstrumento?.codInstrumento1 === 'ECT'
              ? 'Rendir Evaluación'
              : data[0].infoInstrumento?.codInstrumento2 === 'EP'
                ? 'Rendir Encuesta'
                : data[0].infoInstrumento?.codInstrumento2 === 'ECT'
                  ? 'Rendir Evaluación'
                  : data[0].infoInstrumento?.codInstrumento2 === 'EP' && 'Rendir Encuensta'}
        </Typography>
      </Box>

      <Box sx={{ marginTop: 5, display: 'flex', flexDirection: { md: 'column', sm: 'column', xs: 'column', lg: 'row' }, gap: 2, justifyContent: 'center', alignItems: 'center' }}>
        {data[0].infoInstrumento?.codInstrumento1 === 'ECT' && (data[0].infoValidacion?.estadoECT === 'ECT NO REALIZADA' || data[0].infoValidacion?.estadoECT === 'ECT REALIZADA PARCIALMENTE') && data[0].infoValidacion?.condiciones_ECT && (
          <Card sx={{ minHeight: 500, width: '100%' }}>
            <CardMedia
              sx={{ height: 200 }}
              image={ImgPct}
              title='Evaluación de conocimiento teóricos'
            />
            <CardContent sx={{ minHeight: 350 }}>
              <Typography gutterBottom variant='h5' component='div'>
                Evaluación de conocimiento teóricos
              </Typography>
              <Typography variant='body2' color='text.secondary' sx={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 'bold' }}>Instrucciones</span>
                <span> 1.- Tiene un máximo de 120 minutos (2 horas) para responder.</span>
                <span> 2.- Lea atentamente cada pregunta y responda de acuerdo a lo que sabe.</span>
                <span> 3.- Para responder, debe marcar una alternativa de respuesta o de selección múltiple según corresponda.</span>
                <span> 4.- Cuando se equivoque, seleccione la nueva respuesta y cuando esté seguro oprima CONFIRMAR.</span>
                <span> 5.- Esta prohibido fotografiar y copiar la prueba.</span>
                <span> 6.- Para finalizar la prueba, seleccione la opción ENVIAR.</span>
              </Typography>
            </CardContent>
            <CardActions sx={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant='outlined' color='success' onClick={() => rendirPrueba('ECT', 1)} sx={{ fontWeight: 'bold' }}>Rendir Evaluación</Button>
            </CardActions>
          </Card>
        )}

        {data[0].infoInstrumento?.codInstrumento1 === 'EP' && (data[0].infoValidacion?.estadoEP === 'EP NO REALIZADA' || data[0].infoValidacion?.estadoEP === 'EP REALIZADA PARCIALMENTE') && data[0].infoValidacion?.condiciones_EP && (
          <Card sx={{ minHeight: 500, width: '100%' }}>
            <CardMedia
              sx={{ height: 200 }}
              image={ImgEP}
              title='Encuesta de percepción'
            />
            <CardContent sx={{ minHeight: 350 }}>
              <Typography gutterBottom variant='h5' component='div'>
                Encuesta de percepción
              </Typography>
              <Typography variant='body2' color='text.secondary' sx={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 'bold' }}>Instrucciones</span>
                <span>1.- Tiene un máximo de 60 minutos (1 hora) para responder.</span>
                <span>2.- Lea atentamente cada afirmación y responda de acuerdo a su nivel de acuerdo o desacuerdo.</span>
                <span>3.- Para responder, debe seleccionar una alternativa de la siguiente Escala de Apreciación:</span>
                <br />
                <span>a) Totalmente de Acuerdo.</span>
                <span>b) De Acuerdo.</span>
                <span>c) Indiferente.</span>
                <span>d) En Desacuerdo.</span>
                <span>e) Totalmente en Desacuerdo.</span>
                <br />
                <span>5.- Esta prohibido fotografiar y copiar la Encuesta. </span>
                <span>6.- Para finalizar la encuesta, seleccione la opción ENVIAR.</span>
              </Typography>
            </CardContent>
            <CardActions sx={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant='outlined' color='success' sx={{ fontWeight: 'bold' }} onClick={() => rendirPrueba('EP', 2)}>Rendir Evaluación</Button>
            </CardActions>
          </Card>
        )}

        {data[0].infoInstrumento?.codInstrumento2 === 'ECT' && (data[0].infoValidacion?.estadoECT === 'ECT NO REALIZADA' || data[0].infoValidacion?.estadoECT === 'ECT REALIZADA PARCIALMENTE') && data[0].infoValidacion?.condiciones_ECT && (
          <Card sx={{ minHeight: 500, width: '100%' }}>
            <CardMedia
              sx={{ height: 200 }}
              image={ImgPct}
              title='Evaluación de conocimiento teóricos'
            />
            <CardContent sx={{ minHeight: 350 }}>
              <Typography gutterBottom variant='h5' component='div'>
                Evaluación de conocimiento teóricos
              </Typography>
              <Typography variant='body2' color='text.secondary' sx={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 'bold' }}>Instrucciones</span>
                <span> 1.- Tiene un máximo de 120 minutos (2 horas) para responder.</span>
                <span> 2.- Lea atentamente cada pregunta y responda de acuerdo a lo que sabe.</span>
                <span> 3.- Para responder, debe marcar una alternativa de respuesta o de selección múltiple según corresponda.</span>
                <span> 4.- Cuando se equivoque, seleccione la nueva respuesta y cuando esté seguro oprima CONFIRMAR.</span>
                <span> 5.- Esta prohibido fotografiar y copiar la prueba.</span>
                <span> 6.- Para finalizar la prueba, seleccione la opción ENVIAR.</span>
              </Typography>
            </CardContent>
            <CardActions sx={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant='outlined' color='success' onClick={() => rendirPrueba('ECT', 1)} sx={{ fontWeight: 'bold' }}>Rendir Evaluación</Button>
            </CardActions>
          </Card>
        )}

        {data[0].infoInstrumento?.codInstrumento2 === 'EP' && (data[0].infoValidacion?.estadoEP === 'EP NO REALIZADA' || data[0].infoValidacion?.estadoEP === 'EP REALIZADA PARCIALMENTE') && data[0].infoValidacion?.condiciones_EP && (
          <Card sx={{ minHeight: 500, width: '100%' }}>
            <CardMedia
              sx={{ height: 200 }}
              image={ImgEP}
              title='Encuesta de percepción'
            />
            <CardContent sx={{ minHeight: 350 }}>
              <Typography gutterBottom variant='h5' component='div'>
                Encuesta de percepción
              </Typography>
              <Typography variant='body2' color='text.secondary' sx={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 'bold' }}>Instrucciones</span>
                <span>1.- Tiene un máximo de 60 minutos (1 hora) para responder.</span>
                <span>2.- Lea atentamente cada afirmación y responda de acuerdo a su nivel de acuerdo o desacuerdo.</span>
                <span>3.- Para responder, debe seleccionar una alternativa de la siguiente Escala de Apreciación:</span>
                <br />
                <span>a) Totalmente de Acuerdo.</span>
                <span>b) De Acuerdo.</span>
                <span>c) Indiferente.</span>
                <span>d) En Desacuerdo.</span>
                <span>e) Totalmente en Desacuerdo.</span>
                <br />
                <span>5.- Esta prohibido fotografiar y copiar la Encuesta. </span>
                <span>6.- Para finalizar la encuesta, seleccione la opción ENVIAR.</span>
              </Typography>
            </CardContent>
            <CardActions sx={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant='outlined' color='success' sx={{ fontWeight: 'bold' }} onClick={() => rendirPrueba('EP', 2)}>Rendir Evaluación</Button>
            </CardActions>
          </Card>
        )}
      </Box>
      <Box sx={{ top: 'auto', marginTop: 2, marginBottom: { xs: 10, sm: 10, md: 10, lg: 10 }, display: 'flex', flexDirection: 'row', gap: 2 }}>
        <Button variant='contained' color='error' sx={{ fontWeight: 'bold' }} onClick={() => handleBackCandidato()} startIcon={<ArrowBackIcon />}> Atrás </Button>
      </Box>
    </Container>
  )
}
