import { Page, Text, Document, Image, View, Font } from '@react-pdf/renderer'
import Helvetica from '../../assets/Helvetica.ttf'
import HelveticaBold from '../../assets/Helvetica-Bold.ttf'
import HelveticaItalic from '../../assets/Helvetica-Oblique.ttf'
import Logo from '../../assets/logot.png'
import FirmaCarolina from '../../assets/FirmaCarolina.png'
import { useEffect, useState } from 'react'
import bwipjs from 'bwip-js'
import { FormatRut } from '../../Helpers/FormatRut'
import { FormatDate } from '../../Helpers/FormatDate'
import moment from 'moment'

export const Pdf = ({ data, brechas }) => {
  moment.updateLocale('es', {
    months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
    monthsShort: 'Enero._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dec.'.split('_'),
    weekdays: 'Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado'.split('_'),
    weekdaysShort: 'Dom._Lun._Mar._Mier._Jue._Vier._Sab.'.split('_'),
    weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split('_'),
    week: {
      dow: 1
    }
  })
  const [barcodeSrc, setBarcodeSrc] = useState('')
  const fecha = moment().format('D [de] MMMM [de] YYYY')
  const fechaBarra = moment().format('YYYY-MM-DD HH:mm')

  const infoBarra = data[0]?.nombreCompletoUsuario + '|' + FormatRut(data[0]?.runUsuario) + '|' + data[0]?.nombreEmpresa + '|' + '%FINAL:' + data[0]?.porcentFinal + '|' + data[0]?.resolucion + '|' + fechaBarra

  Font.register({
    family: 'Tinos',
    fonts: [
      { src: Helvetica },
      { src: HelveticaBold, fontWeight: 'bold' },
      { src: HelveticaItalic, fontStyle: 'italic' }
    ]
  })

  Font.registerHyphenationCallback(word => [word])

  const normalizeText = (text) => {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Elimina los acentos
  }

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      bwipjs.toCanvas(canvas, {
        bcid: 'pdf417',
        text: normalizeText(infoBarra),
        scale: 3,
        height: 10,
        includetext: true,
        textxalign: 'center'
      })
      const imgBase64 = canvas.toDataURL('image/png')
      setBarcodeSrc(imgBase64)
    } catch (err) {
      console.error(err)
    }
  }, [])

  return (
    <Document>
      {data[0]?.resolucion !== 'Bajo' && (
        <Page size='A4' style={{ fontFamily: 'Tinos', paddingLeft: 71, paddingRight: 71, paddingTop: 85, paddingBottom: 85 }}>
          {/*  CABECERA */}
          <View
            fixed
            style={{
              position: 'absolute',
              top: 10,
              left: 71,
              right: 71,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <View>
              <Image source={Logo} style={{ width: '100' }} />
            </View>

          </View>
          {/* TITULO */}
          <View style={{ display: 'flex', alignItems: 'center', paddingTop: 20 }}>
            <Text style={{ fontSize: 19, fontWeight: 'bold' }}>MG CERTIFICA LTDA.</Text>
          </View>
          {/* TEXTO DEBAJO TITULO */}
          <View style={{ fontFamily: 'Tinos', fontSize: 8, textAlign: 'center', paddingTop: 2 }}>
            <Text>Centro de Evaluación y Certificación de </Text>
            <Text>Competencias Laborales Acreditado por </Text>
            <Text>Chile Valora - Ley N°20.267</Text>
          </View>
          <View style={{ display: 'flex', alignItems: 'center', paddingTop: 50 }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold' }}>CERTIFICADO DE CONOCIMIENTOS ESPECÍFICOS</Text>
            <Text style={{ fontSize: 14, fontWeight: 'bold' }}>LEY 21.643</Text>
          </View>

          <View style={{ display: 'flex', textAlign: 'justify', paddingTop: 10 }}>
            <Text style={{ fontSize: 12 }}>
              Mediante el presente Certificado se formaliza que el/la
              <Text style={{ fontWeight: 'bold' }}> Sr(a). {data[0]?.nombreCompletoUsuario} ,
                ID: {FormatRut(data[0]?.runUsuario)}
              </Text>
              {' '}ha sido evaluado para medir el Nivel de Conocimientos que tiene respecto de los aspectos generales relacionados con la Ley 21.643, obteniendo el siguiente resultado final:
            </Text>
          </View>

          <View style={{ display: 'flex', textAlign: 'justify', borderWidth: 1, padding: 10, marginTop: 30, marginBottom: 30, borderColor: 'black' }}>
            <Text style={{ fontSize: 14 }}>El/La Colaborador(a) presenta un Nivel de Conocimiento <Text style={{ fontWeight: 'bold' }}>{data[0]?.resolucion.toUpperCase()} </Text>de los contenidos y alcances de la Ley 21.643.- </Text>
          </View>

          <View style={{ display: 'flex', textAlign: 'justify', paddingTop: 60, marginBottom: 20 }}>
            <Text style={{ fontSize: 10, fontStyle: 'italic' }}>{fecha}</Text>
          </View>
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 20 }}>
            <Image src={barcodeSrc} style={{ width: 200, height: 50 }} />
            <Image src={FirmaCarolina} style={{ width: 240, height: 160 }} />
          </View>
          <View
            fixed
            style={{
              position: 'absolute',
              bottom: 10,
              left: 0,
              right: 0,
              height: 20,
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              flexDirection: 'column',
              fontSize: 8,
              marginLeft: 71,
              marginRight: 71,
              borderTopWidth: 1,
              borderTopColor: 'gray',
              paddingTop: 4,
              gap: 4,
              color: 'gray'
            }}
          />
        </Page>
      )}

      <Page size='A4' style={{ fontFamily: 'Tinos', paddingLeft: 71, paddingRight: 71, paddingTop: 85, paddingBottom: 85 }}>
        {/*  CABECERA */}
        <View
          fixed
          style={{
            display: 'flex',
            position: 'absolute',
            top: 10,
            left: 71,
            right: 71,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <View>
            <Image source={Logo} style={{ width: '100' }} />
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              paddingLeft: 170,
              borderBottom: '1px solid gray',
              paddingBottom: 5
            }}
          >
            <Text style={{ fontSize: 8, paddingTop: 2, color: 'gray' }}>Informe de Evaluación de Conocimientos</Text>
            <Text style={{ fontSize: 8, color: 'gray' }}>{fecha} </Text>
          </View>
        </View>

        <View style={{ display: 'flex', paddingTop: 20, width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold' }}>INFORME DE EVALUACIÓN DE CONOCIMIENTOS ESPECÍFICOS</Text>
          <Text style={{ fontSize: 14, fontWeight: 'bold' }}> RELACIONADOS CON LA LEY 21.643</Text>
        </View>

        <View style={{ fontFamily: 'Tinos', fontSize: 11, textAlign: 'justify', paddingTop: 10 }}>
          <Text>
            El presente informe contiene el resumen de la evaluación realizada para medir el nivel de conocimientos específicos que tiene el/la colaborador(a) en relación con la Ley 21.643.
          </Text>
        </View>

        <View
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            paddingTop: 20
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: 'bold' }}>I.    ANTECEDENTES GENERALES DE LA EVALUACIÓN</Text>
        </View>

        <View style={{ paddingTop: 20 }}>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <View style={{
              width: '25%',
              textAlign: 'right',
              padding: 4,
              backgroundColor: '#203864',
              color: 'white',
              justifyContent: 'center',
              border: '0.5px',
              borderColor: '#203864'
            }}
            >
              <Text style={{ fontWeight: 'bold', fontSize: 9 }}>Antecedentes del </Text>
              <Text style={{ fontWeight: 'bold', fontSize: 9 }}>candidato:</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'column', width: '75%' }}>
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                <View
                  style={{
                    backgroundColor: '#E0DFDF',
                    width: '65%',
                    paddingBottom: 3,
                    marginLeft: 1,
                    justifyContent: 'center'
                  }}
                >
                  <Text style={{ marginLeft: 2, fontSize: 9 }}>Sr(a). {data[0]?.nombreCompletoUsuario} </Text>
                </View>
                <View
                  style={{
                    backgroundColor: '#E0DFDF',
                    display: 'flex',
                    width: '35%',
                    paddingTop: 3,
                    paddingBottom: 3,
                    justifyContent: 'center'
                  }}
                >
                  <Text style={{ padding: 3, fontSize: 9 }}>ID Candidato: {FormatRut(data[0]?.runUsuario)}</Text>
                </View>
              </View>
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                <View
                  style={{
                    backgroundColor: '#E0DFDF',
                    width: '100%',
                    height: 'auto',
                    justifyContent: 'center',
                    paddingTop: 3,
                    paddingBottom: 3
                  }}
                >
                  <Text style={{ wordBreak: 'break-all', whiteSpace: 'pre-wrap', paddingTop: 3, paddingBottom: 3, marginLeft: 2, fontSize: 9 }}>Empresa:  {data[0]?.nombreEmpresa}</Text>
                </View>

              </View>
              <View style={{ backgroundColor: '#E0DFDF', display: 'flex', width: '100%', paddingTop: 3, paddingBottom: 3, height: 'auto', alignItems: 'flex-start' }}>
                <Text style={{ marginLeft: 2, paddingTop: 3, paddingBottom: 3, fontSize: 9 }}>Área:{data[0]?.areaEmpresa} </Text>
              </View>
            </View>
          </View>

          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <View style={{
              width: '25%',
              textAlign: 'right',
              padding: 4,
              backgroundColor: '#203864',
              color: 'white',
              justifyContent: 'center',
              border: '0.5px',
              borderColor: '#203864'
            }}
            >
              <Text style={{ fontWeight: 'bold', fontSize: 9 }}>Fecha de </Text>
              <Text style={{ fontWeight: 'bold', fontSize: 9 }}>Evaluación:</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'column', width: '75%' }}>
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                <View
                  style={{
                    backgroundColor: '#E0DFDF',
                    width: '100%',
                    paddingBottom: 3,
                    height: '30',
                    justifyContent: 'center'
                  }}
                >
                  <Text style={{ marginLeft: 2, fontSize: 9 }}>Evaluación Teórica: {FormatDate(data[0]?.fechaEvaluacion)} </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <View
              style={{
                width: '25%',
                textAlign: 'right',
                backgroundColor: '#203864',
                color: 'white',
                justifyContent: 'center',
                border: '0.5px',
                borderColor: '#203864',
                padding: 4
              }}
            >
              <Text style={{ fontWeight: 'bold', fontSize: 9 }}>Condición de la</Text>
              <Text style={{ fontWeight: 'bold', fontSize: 9 }}>Evaluación:</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'column', width: '75%' }}>
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                <View
                  style={{
                    backgroundColor: '#E0DFDF',
                    width: '100%',
                    height: '30',
                    justifyContent: 'center'
                  }}
                >
                  <Text style={{ marginLeft: 2, fontSize: 9 }}>La evaluación fue realizada vía electrónica asincrónica, con una duración de {data[0].tiempoTranscurrido} minutos. </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View
          fixed
          style={{
            position: 'absolute',
            bottom: 10,
            left: 0,
            right: 0,
            height: 20,
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            flexDirection: 'column',
            fontSize: 8,
            marginLeft: 71,
            marginRight: 71,
            borderTopWidth: 1,
            borderTopColor: 'gray',
            paddingTop: 4,
            gap: 4,
            color: 'gray'
          }}
        />
      </Page>

      <Page size='A4' style={{ fontFamily: 'Tinos', paddingLeft: 71, paddingRight: 71, paddingTop: 85, paddingBottom: 85 }}>
        <View
          fixed
          style={{
            position: 'absolute',
            top: 10,
            left: 71,
            right: 71,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: 10
          }}
        >
          <View>
            <Image source={Logo} style={{ width: '100' }} />
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              paddingLeft: 170,
              borderBottom: '1px solid gray',
              paddingBottom: 5,
              color: 'gray'

            }}
          >
            <Text style={{ fontSize: 8, paddingTop: 4 }}>Informe de Evaluación de Conocimientos</Text>
            <Text style={{ fontSize: 8 }}>{fecha} </Text>
          </View>
        </View>

        <View style={{ display: 'flex', alignItems: 'flex-start', paddingTop: 15 }}>
          <Text style={{ fontSize: 12, fontWeight: 'bold' }}>II.    INFORME GENERAL DE CONOCIMIENTOS DESCENDIDOS </Text>
        </View>

        <View style={{ display: 'flex', alignItems: 'flex-start', marginTop: 20, backgroundColor: '#203864', color: 'white', paddingLeft: 10, paddingTop: 4, paddingBottom: 4 }}>
          <Text style={{ fontSize: 9, fontWeight: 'bold' }}>Conocimientos Teóricos</Text>
        </View>

        {brechas && brechas.length > 0 && (
          <View style={{ display: 'flex', alignItems: 'flex-start', backgroundColor: '#E0DFDF', padding: 10, borderWidth: 0.5, borderColor: '#E0DFDF' }}>
            <Text style={{ fontSize: 9 }}>
              •El/la colaborador(a) presenta los siguientes conocimientos descendidos, relacionados con la Ley 21.643.
            </Text>
          </View>
        )}

        {brechas && brechas.length === 0 && (
          <View style={{ display: 'flex', flexDirection: 'column', width: '100%', fontSize: 9, backgroundColor: '#E0DFDF', padding: 10, borderWidth: 0.5, borderColor: '#E0DFDF' }}>
            <View style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
              <View style={{ width: '100%', paddingTop: 10 }}>
                <Text>•El/la colaborador(a) no presenta conocimientos descendidos, relacionados con la Ley 21.643.</Text>
              </View>
            </View>
          </View>
        )}

        {brechas && brechas.map((item, index) => {
          const isFirstBreak = index === 11
          const isSecondBreak = index > 11 && (index - 11) % 12 === 0
          const isLastElement = index === brechas.length - 1
          const isPreBreak = index === 10 || (index > 11 && (index - 11) % 12 === 11)
          return (
            <View
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                fontSize: 9,
                backgroundColor: '#E0DFDF',
                paddingBottom: isPreBreak || isLastElement ? 10 : 0,
                paddingTop: isFirstBreak || isSecondBreak ? 10 : 0
              }}
              break={isFirstBreak || isSecondBreak}
              wrap={false}
            >
              <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%', borderTop: 'none', paddingLeft: 10, paddingRight: 10 }}>
                <View style={{ width: '100%', padding: 12, borderWidth: 1, borderColor: 'white', borderBottom: '1px solid white' }}>
                  <Text style={{ textAlign: 'justify' }}>• {item.descBrechaRegistroEvaluacionTeoricas}</Text>
                </View>
              </View>
            </View>
          )
        })}

        <View
          fixed
          style={{
            position: 'absolute',
            bottom: 10,
            left: 0,
            right: 0,
            height: 20,
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            flexDirection: 'column',
            fontSize: 8,
            marginLeft: 71,
            marginRight: 71,
            borderTopWidth: 1,
            borderTopColor: 'gray',
            paddingTop: 4,
            gap: 4,
            color: 'gray'
          }}
        />
      </Page>

      <Page size='A4' style={{ fontFamily: 'Tinos', paddingLeft: 71, paddingRight: 71, paddingTop: 85, paddingBottom: 85 }}>
        {/*  CABECERA */}
        <View
          fixed
          style={{
            position: 'absolute',
            top: 10,
            left: 71,
            right: 71,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <View>
            <Image source={Logo} style={{ width: '100' }} />
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              paddingLeft: 170,
              borderBottom: '1px solid gray',
              paddingBottom: 5,
              color: 'gray'
            }}
          >
            <Text style={{ fontSize: 8, paddingTop: 2 }}>Informe de Evaluación de Conocimientos</Text>
            <Text style={{ fontSize: 8 }}>{fecha} </Text>
          </View>
        </View>
        <View style={{ display: 'flex', alignItems: 'right', paddingTop: 20 }}>
          <Text style={{ fontSize: 12, fontWeight: 900 }}>III.    CONCLUSIÓN GENERAL</Text>
        </View>
        <View style={{ paddingTop: 10 }}>
          <Text style={{ fontSize: 11 }}>El/la colaborador(a) obtuvo el siguiente resultado final:</Text>
        </View>
        <View style={{ marginTop: 10, borderWidth: '1px', borderColor: 'black' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#203864', color: 'white', fontWeight: 'bold' }}>
            <View style={{ alignItems: 'center', width: '60%', paddingTop: 4, paddingBottom: 4 }}>
              <Text style={{ fontSize: 11 }}>Instrumento</Text>
            </View>
            <View style={{ alignItems: 'center', width: '40%', paddingTop: 4, paddingBottom: 4 }}>
              <Text style={{ fontSize: 11 }}>Porcentaje de logro</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', color: 'black', paddingBottom: 5, backgroundColor: '#d9e2f3' }}>
            <View style={{ alignItems: 'left', width: '60%' }}>
              <Text style={{ fontSize: 11, paddingLeft: 10 }}>Evaluación Teórica</Text>
            </View>
            <View style={{ alignItems: 'center', width: '40%' }}>
              <Text style={{ fontSize: 11 }}>{data[0]?.porcentFinal}%</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', color: 'black', paddingBottom: 5 }}>
            <View style={{ alignItems: 'left', width: '60%' }}>
              <Text style={{ fontSize: 9, paddingLeft: 10 }}>Conocimientos descendidos relacionados con la Ley 21.643</Text>
            </View>
            <View style={{ alignItems: 'center', width: '40%' }}>
              <Text style={{ fontSize: 9 }}>{brechas && brechas.length > 0 ? 'Tiene' : 'No Tiene'}</Text>
            </View>
          </View>
        </View>
        <View style={{ paddingTop: 10 }}>
          <Text style={{ fontSize: 11 }}>En conclusión, el resultado final es: </Text>
        </View>
        <View style={{ alignItems: 'center', paddingTop: 10 }}>
          <View style={{ border: 2, width: '90%', textAlign: 'justify', padding: 10, fontSize: 14 }}>
            <Text>El/La Colaborador(a) presenta un Nivel de Conocimiento <Text style={{ fontWeight: 'bold' }}>{data[0]?.resolucion.toUpperCase()} </Text> de los contenidos y alcances de la Ley 21.643.-</Text>
          </View>
        </View>
        <View style={{ paddingTop: 65 }}>
          <Text style={{ fontSize: 11 }}>Autoriza: </Text>
        </View>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 50 }}>
          <Image src={barcodeSrc} style={{ width: 200, height: 50 }} />
          <Image src={FirmaCarolina} style={{ width: 240, height: 160 }} />
        </View>
        <View style={{ marginTop: 120 }}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', paddingBottom: 2 }}>Rúbrica de Evaluación: </Text>

          <Text style={{ fontSize: 6.5, paddingBottom: 2 }}>Para ejecutar este proceso de evaluación, se han utilizado la siguiente Rúbrica: </Text>
          <View style={{ display: 'flex', flexDirection: 'row', gap: 20 }}>
            <View style={{ width: '50%' }}>
              <View style={{ fontSize: 6 }}>
                <View style={{ display: 'flex', flexDirection: 'row', borderWidth: 0.5 }}>
                  <View style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 6 }}>Tabla de Calificación General </Text>
                  </View>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', borderWidth: 0.5, borderTop: 'none' }}>
                  <View style={{ width: '35%', textAlign: 'center', justifyContent: 'center', borderWidth: 0.5, borderTop: 'none', borderBottom: 'none', borderLeft: 'none' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 6 }}>De 00% a 69,9%</Text>
                  </View>
                  <View style={{ display: 'flex', flexDirection: 'column', width: '75%' }}>
                    <View style={{ display: 'flex', flexDirection: 'column' }}>
                      <View style={{ width: '100%', paddingBottom: 3, justifyContent: 'center' }}>
                        <Text style={{ marginLeft: 2, fontSize: 6 }}>Nivel de conocimiento Bajo</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              <View style={{ fontSize: '8px' }}>
                <View style={{ display: 'flex', flexDirection: 'row', borderWidth: 0.5, borderTop: 'none' }}>
                  <View style={{ width: '35%', textAlign: 'center', justifyContent: 'center', borderWidth: 0.5, borderTop: 'none', borderBottom: 'none', borderLeft: 'none' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 6 }}>De 70% a 79,9%</Text>
                  </View>
                  <View style={{ display: 'flex', flexDirection: 'column', width: '75%' }}>
                    <View style={{ display: 'flex', flexDirection: 'column' }}>
                      <View style={{ width: '100%', paddingBottom: 3, justifyContent: 'center' }}>
                        <Text style={{ marginLeft: 2, fontSize: 6 }}>Nivel de conocimiento Medio</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              <View style={{ fontSize: '8px' }}>
                <View style={{ display: 'flex', flexDirection: 'row', borderWidth: 0.5, borderTop: 'none' }}>
                  <View style={{ width: '35%', textAlign: 'center', justifyContent: 'center', borderWidth: 0.5, borderTop: 'none', borderBottom: 'none', borderLeft: 'none' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 6 }}>De 80% a 100%</Text>
                  </View>
                  <View style={{ display: 'flex', flexDirection: 'column', width: '75%' }}>
                    <View style={{ display: 'flex', flexDirection: 'column' }}>
                      <View style={{ width: '100%', paddingBottom: 3, justifyContent: 'center' }}>
                        <Text style={{ marginLeft: 2, fontSize: 6 }}>Nivel de conocimiento Alto</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View
          fixed
          style={{
            position: 'absolute',
            bottom: 10,
            left: 0,
            right: 0,
            height: 20,
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            flexDirection: 'column',
            fontSize: 8,
            marginLeft: 71,
            marginRight: 71,
            borderTopWidth: 1,
            borderTopColor: 'gray',
            paddingTop: 4,
            gap: 4,
            color: 'gray'
          }}
        />
      </Page>
    </Document>
  )
}
