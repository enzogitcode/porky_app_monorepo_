import React from 'react'
import type { VacunaAplicada } from '../../types/pigTypes'

const PorkVacunaAplicadaCard:React.FC<VacunaAplicada> = (props) => {
  return (
    <div>
        <h4>Fecha y hora de aplicación</h4>
        <p>Vacuna Id: {props._id}</p>
        <p>Fecha de Vacunación: {new Date(props.fechaVacunacion).toLocaleDateString()}</p>
        <p>Hora de Vacunación: {new Date(props.fechaVacunacion).toLocaleTimeString()}</p>
        <p><strong>Dosis aplicada:</strong> {props.dosis || 'No registrada'}</p>
    </div>
  )
}

export default PorkVacunaAplicadaCard