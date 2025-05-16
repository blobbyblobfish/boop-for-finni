import './App.css';
import { Auth } from './components/auth.js'
import { PatientsTable } from './components/table.js'
// import { db } from './firebase-config.js'
// import { getDocs, collection } from 'firebase/firestore'
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
          <Auth />
          <PatientsTable />
        </header>
      </div>
    </QueryClientProvider>
  )
}

export default App
