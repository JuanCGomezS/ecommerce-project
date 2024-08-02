import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './Pages/App'
import './index.css'

function Main() {
  useEffect(() => {
    document.title = import.meta.env.VITE_APP_TITLE;
  }, []);

  return <App />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
)
