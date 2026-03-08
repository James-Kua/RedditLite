import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'  
import betterlytics from "@betterlytics/tracker"

betterlytics.init("reddit-lite-mmhc8b0s")
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
