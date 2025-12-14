import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import LoadingSpinner from './components/LoadingSpinner'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Suspense fallback={<LoadingSpinner />}>
      <App />
    </Suspense>
  </React.StrictMode>
)