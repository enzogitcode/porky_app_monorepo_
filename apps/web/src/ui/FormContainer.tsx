import React from 'react'

interface FormContainerProps {
    className?:string
    children:React.ReactNode
}

const FormContainer:React.FC<FormContainerProps> = ({children, className}) => {
  return (
    <div className={`border-2 border-gray-700 ${className ?? ""}`}>
        {children}
    </div>
  )
}

export default FormContainer