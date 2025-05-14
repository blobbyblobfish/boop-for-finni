import logo from './logo.svg';
import './App.css';
import { Auth } from './components/auth.js'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Auth />
      </header>
    </div>
  );
}

export default App;
