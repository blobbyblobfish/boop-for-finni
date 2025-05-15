import './App.css';
import { useEffect, useState } from 'react'
import { Auth } from './components/auth.js'
import { PatientTable } from './components/table.js'
import { db } from './firebase-config.js'
import { getDocs, collection } from 'firebase/firestore'

function App() {

  const [patientList, setPatientList] = useState([])

  const patientsCollectionRef = collection(db, "patients")

  useEffect(() => {
    const getPatientsList = async () => {
      try {
        const patientData = await getDocs(patientsCollectionRef)

        const filteredPatientData = patientData.docs.map((doc) => ({...doc.data(), id: doc.id}))

        setPatientList(filteredPatientData)
      } catch (error) {
        // handle error
      }
    }

    getPatientsList()
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <Auth />
        <PatientTable patients={patientList}/>
      </header>
    </div>
  );
}

export default App;
