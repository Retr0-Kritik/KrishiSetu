import { createRoot } from 'react-dom/client'
import { Provider } from 'jotai'
import './styles/index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <Provider>
    <App />
  </Provider>,
)
