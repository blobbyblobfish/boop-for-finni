import './App.css'
// import { Auth } from './components/auth.js'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
import { PatientsTable } from './components/table.js'


const queryClient = new QueryClient()

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider> 
          <ModalsProvider>
            <Notifications position='center'/>
            <div className="App">
              <header className="App-header">
                <img src="https://cdn.prod.website-files.com/6297d5d89ac9c5b4308579e1/6297d5d89ac9c581808579f2_Hero%20Side%20Image.svg"></img>
                <h1>Finni Dashboard</h1>
                {/* <Auth /> */}
                <div style={{overflowX: "auto", maxWidth: "99%", textAlign: "left"}}>
                  <PatientsTable />
                </div>
              </header>
            </div>
          </ModalsProvider>
      </MantineProvider>
    </QueryClientProvider>
  )
}

export default App
