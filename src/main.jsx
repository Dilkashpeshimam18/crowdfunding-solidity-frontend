import React from 'react'
import ReactDom from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { ThirdwebProvider } from '@thirdweb-dev/react'
import { Sepolia } from "@thirdweb-dev/chains";
import './index.css';
import App from './App'

const root = ReactDom.createRoot(document.getElementById('root'))

root.render(
    <ThirdwebProvider activeChain={Sepolia}>
        <Router>
            <App />
        </Router>
    </ThirdwebProvider>
)
