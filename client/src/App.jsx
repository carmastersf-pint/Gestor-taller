import { useEffect, useState } from "react";

function App() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({ nombre: "", telefono: "", correo: "" });

  // Cargar clientes
  const cargarClientes = async () => {
    const res = await fetch("http://localhost:3001/clientes");
    const data = await res.json();
    setClientes(data);
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  // Crear cliente
  const crearCliente = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:3001/clientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ nombre: "", telefono: "", correo: "" });
    cargarClientes();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Gestor CarMasters</h1>

      <h2>Crear cliente</h2>
      <form onSubmit={crearCliente}>
        <input
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
        />
        <input
          placeholder="Teléfono"
          value={form.telefono}
          onChange={(e) => setForm({ ...form, telefono: e.target.value })}
        />
        <input
          placeholder="Correo"
          value={form.correo}
          onChange={(e) => setForm({ ...form, correo: e.target.value })}
        />
        <button type="submit">Guardar</button>
      </form>

      <h2>Clientes registrados</h2>
      <ul>
        {clientes.map(c => (
          <li key={c.id}>
            {c.nombre} – {c.telefono} – {c.correo}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
