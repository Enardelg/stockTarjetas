
import './App.css'
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";

function App() {
  const [openingStock, setOpeningStock] = useState(0);
  const [deliveries, setDeliveries] = useState([]);
  const [mailReceipts, setMailReceipts] = useState([]);
  const [closingStock, setClosingStock] = useState(0);

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const storedOpeningStock = localStorage.getItem("openingStock");
    const storedDeliveries = JSON.parse(localStorage.getItem("deliveries")) || [];
    const storedMailReceipts = JSON.parse(localStorage.getItem("mailReceipts")) || [];

    if (storedOpeningStock) setOpeningStock(Number(storedOpeningStock));
    setDeliveries(storedDeliveries);
    setMailReceipts(storedMailReceipts);
    calculateClosingStock(storedOpeningStock, storedDeliveries, storedMailReceipts);
  }, []);

  // Guardar datos en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem("openingStock", openingStock);
    localStorage.setItem("deliveries", JSON.stringify(deliveries));
    localStorage.setItem("mailReceipts", JSON.stringify(mailReceipts));
    calculateClosingStock(openingStock, deliveries, mailReceipts);
  }, [openingStock, deliveries, mailReceipts]);

  const calculateClosingStock = (opening, delivs, mails) => {
    const totalDeliveries = delivs.reduce((sum, d) => sum + d.amount, 0);
    const totalMailReceipts = mails.reduce((sum, m) => sum + m.amount, 0);
    setClosingStock(Number(opening) - totalDeliveries + totalMailReceipts);
  };

  const handleAddDelivery = (amount, responsible) => {
    setDeliveries([...deliveries, { amount: Number(amount), responsible }]);
    // Limpiar los inputs después de agregar una entrega
    document.getElementById("deliveryAmount").value = "";
    document.getElementById("deliveryResponsible").value = "";
  };

  const handleAddMailReceipt = (amount, provider) => {
    setMailReceipts([...mailReceipts, { amount: Number(amount), provider }]);
    // Limpiar los inputs después de agregar una recepción
    document.getElementById("mailAmount").value = "";
    document.getElementById("mailProvider").value = "Andreani";  // Establecer valor predeterminado
  };

  const handleReset = () => {
    setOpeningStock(0);
    setDeliveries([]);
    setMailReceipts([]);
    setClosingStock(0);
    localStorage.clear();
  };

  const handleNextDay = () => {
    // Copiar el valor de Stock de Cierre al Stock de Apertura
    setOpeningStock(closingStock);
    // Limpiar las entregas y recepciones para el nuevo día
    setDeliveries([]);
    setMailReceipts([]);
    setClosingStock(0); // Restablecer el stock de cierre
  };

  return (
    <div>
      <h1 className='titulo-principal'>Gestión de Stock de Tarjetas</h1>

      {/* Stock de Apertura */}
      <div className='stock-apertura'>
        <label className='label'>Stock de Apertura:</label>
        <input
          type="number"
          min="0"
          value={openingStock === "" ? "" : openingStock}
          onChange={(e) => {
            const value = e.target.value;
            if (Number(value) >= 0 || value === "") {
              setOpeningStock(value === "" ? "" : Number(value));
            }
          }}
        />
      </div>

      {/* Registrar Entregas */}
      <div className='registro-entregas'>
        <h2>Registrar Entregas</h2>
        <input className='input-cantidad'
          type="number"
          min="0"
          placeholder="Cantidad"
          id="deliveryAmount"
          onChange={(e) => {
            if (Number(e.target.value) < 0) {
              e.target.value = "";
            }
          }}
        />
        <input className='input-cantidad'
          type="text"
          placeholder="Responsable"
          id="deliveryResponsible"
        />
        <button className='anadir'
          onClick={() =>
            handleAddDelivery(
              document.getElementById("deliveryAmount").value,
              document.getElementById("deliveryResponsible").value
            )
          }
        >
          Añadir Entrega
        </button>
      </div>

      {/* Mostrar lista de entregas */}
      <div className='lista'>
        <h3>Lista de Entregas:</h3>
        <ul>
          {deliveries.map((delivery, index) => (
            <li key={index}>
              {delivery.amount} tarjetas entregadas por {delivery.responsible}
            </li>
          ))}
        </ul>
      </div>

      {/* Registrar Recepción por Correo */}
      <div className='ingreso'>
        <h2>Registrar Recepción por Correo</h2>
        <input className='input-cantidad'
          type="number"
          min="0"
          placeholder="Cantidad"
          id="mailAmount"
          onChange={(e) => {
            if (Number(e.target.value) < 0) {
              e.target.value = "";
            }
          }}
        />
        <select id="mailProvider">
          <option value="Andreani">Andreani</option>
          <option value="OCA">OCA</option>
          <option value="Bolsin">Bolsin</option>
        </select>
        <button className='anadir'
          onClick={() =>
            handleAddMailReceipt(
              document.getElementById("mailAmount").value,
              document.getElementById("mailProvider").value
            )
          }
        >
          Añadir Recepción
        </button>
      </div>

      {/* Mostrar lista de recepciones por correo */}
      <div className='lista'>
        <h3>Lista de Recepciones por Correo:</h3>
        <ul className='recepciones'>
          {mailReceipts.map((receipt, index) => (
            <li key={index}>
              {receipt.amount} tarjetas recibidas de {receipt.provider}
            </li>
          ))}
        </ul>
      </div>

      {/* Stock de Cierre */}
      <div className='cierre'>
        <h2>Stock de Cierre</h2>
        <p>{closingStock}</p>
      </div>

      {/* Botón de "Próximo Día" */}
      <button onClick={handleNextDay} className='reiniciar'>Próximo Día</button>

      {/* Botón de Reinicio */}
      <button onClick={handleReset} className='reiniciar'>Reiniciar Día</button>
    </div>
  );
}

export default App;
