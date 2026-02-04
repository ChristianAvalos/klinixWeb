import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import { RouterProvider } from 'react-router-dom'
import router from './router'
import './index.css'
import { ThemeProvider } from './context/ThemeContext'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider  router={router}/>
    </ThemeProvider>
  </StrictMode>,
)
