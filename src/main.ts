import './style.css'
import { testMongoDBConnection } from './database/connection'

// Test MongoDB connection when the app starts
testMongoDBConnection();

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Azure MongoDB Connection</h1>
    <p>Check the console for connection details</p>
  </div>
`
