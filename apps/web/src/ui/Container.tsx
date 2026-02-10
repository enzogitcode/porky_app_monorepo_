import React from 'react'

interface ContainerProps {
children:React.ReactNode
className?:string
}

const Container:React.FC<ContainerProps> = ({children, className}) => {
  return (
    <div className=
    {` flex flex-wrap justify-center self-center-safe p-1.5 m-1.5 border-slate-400 border-2 rounded-2xl ${className ?? ""} `}
    >
{children}
    </div>
  )
}

export default Container