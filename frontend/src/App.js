import { BrowserRouter, Routes, Route} from 'react-router-dom'

// Pages & Components
import Home from './pages/Home'
import Nav from './components/Nav'

function App() {
  return (
    <div className="App">     
      <BrowserRouter>
        <Nav />
        <div className='pages'>
          <Routes>
            <Route 
              path="/"
              element={<Home />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
