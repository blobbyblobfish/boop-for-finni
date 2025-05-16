import './App.css';
import { Auth } from './components/auth.js'
import { PatientsTable } from './components/table.js'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'


const queryClient = new QueryClient()

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <header className="App-header">
          <h1>Finni Database</h1>
          <Auth />
          <div style={{overflowX: "auto", maxWidth: "95%", textAlign: "left"}}>
            <PatientsTable />
          </div>
        </header>
      </div>
    </QueryClientProvider>
  )
}

export default App
