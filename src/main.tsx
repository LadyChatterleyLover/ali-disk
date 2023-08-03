import ReactDOM from 'react-dom/client'
import 'animate.css'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />)

postMessage({ payload: 'removeLoading' }, '*')
