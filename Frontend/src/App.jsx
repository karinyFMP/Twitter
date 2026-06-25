import { Routes, Route } from 'react-router-dom';
import Login from './Login'; // Ajuste os caminhos
import Cadastro from './Cadastro';
import Feed from './Feed'; // Vocês precisam criar essa página!

function App() {
  return (
    <Routes>
      <Route path="/" element={<Feed />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
    </Routes>
  );
}

export default App;