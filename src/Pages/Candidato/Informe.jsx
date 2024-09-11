import React, { useEffect, useState } from 'react'
import { PDFViewer } from '@react-pdf/renderer'
import { Pdf } from './Pdf'
import { ListarInfoInforme } from '../../Functions/ListarInfoInforme'

export const Informe = () => {
  const [infoInforme, setInfoInforme] = useState([])

  const infoInformePDF = async () => {
    try {
      const { error, message, result } = await ListarInfoInforme(1)
      if (!error) {
        setInfoInforme(result)
      } else {
        console.error('Error al obtener datos:', message)
      }
    } catch (error) {
      console.error('Error al ejecutar infoInformePDF:', error)
    }
  }

  useEffect(() => {
    infoInformePDF()
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {infoInforme && infoInforme.informe && infoInforme.brecha && (
        <PDFViewer style={{ height: '100vh' }}>
          <Pdf data={infoInforme.informe} brechas={infoInforme.brecha} />
        </PDFViewer>
      )}
    </div>
  )
}
