import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [cep, setCep] = useState("");
  const [enderecos, setEnderecos] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [ordenarPor, setOrdenarPor] = useState("cidade");
  const [ordem, setOrdem] = useState("asc");

  const buscarCEP = async () => {
    if (cep.length !== 8) {
      setMensagem("CEP inválido! Digite um CEP com 8 números.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/buscar", { cep });
      setMensagem(response.data.message);
      carregarEnderecos();
    } catch (error) {
      setMensagem(error.response?.data?.error || "Erro ao buscar CEP.");
    }
  };

  const carregarEnderecos = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/enderecos?ordenarPor=${ordenarPor}&ordem=${ordem}`);
      setEnderecos(response.data);
    } catch (error) {
      setMensagem("Erro ao carregar endereços.");
    }
  };

  useEffect(() => {
    carregarEnderecos();
  }, [ordenarPor, ordem]);

  return (
    <div>
      <h1>Consulta de Endereço via CEP</h1>
      <input
        type="text"
        placeholder="Digite o CEP"
        value={cep.replace(/(\d{5})(\d{3})/, "$1-$2")}
        onChange={(e) => setCep(e.target.value)}
      />
      <button onClick={buscarCEP}>Buscar</button>

      {mensagem && <p>{mensagem}</p>}

      <h2>Endereços Armazenados</h2>
      <label>Ordenar por:</label>
      <select onChange={(e) => setOrdenarPor(e.target.value)} value={ordenarPor}>
        <option value="cidade">Cidade</option>
        <option value="bairro">Bairro</option>
        <option value="estado">Estado</option>
      </select>

      <button onClick={() => setOrdem(ordem === "asc" ? "desc" : "asc")}>
        Ordem: {ordem === "asc" ? "Crescente" : "Decrescente"}
      </button>

      <ul>
        {enderecos.map((endereco) => (
          <li key={endereco.cep}>
            <strong>{endereco.cep}</strong> - {endereco.logradouro}, {endereco.bairro}, {endereco.cidade} - {endereco.estado}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
