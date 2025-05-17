import './App.css';
// import { Auth } from './components/auth.js'
import { PatientsTable } from './components/table.js'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ModalsProvider } from '@mantine/modals'


const queryClient = new QueryClient()

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <ModalsProvider>
        <div className="App">
          <header className="App-header">
            <h1>Finni Dashboard</h1>
            {/* <Auth /> */}
            <div style={{overflowX: "auto", maxWidth: "99%", textAlign: "left"}}>
              <PatientsTable />
            </div>
          </header>
        </div>
      </ModalsProvider>
    </QueryClientProvider>
  )
}

export default App
