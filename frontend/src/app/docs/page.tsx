import React from 'react'
import SwaggerUI from "swagger-ui-react"
import 'swagger-ui-react/swagger-ui.css'

export default function page() {
  return (
    <div className="bg-white">
        <SwaggerUI url="./swagger.json" />
    </div>
  )
}
