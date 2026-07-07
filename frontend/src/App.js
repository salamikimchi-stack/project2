import { useState, useEffect } from 'react';

function App() {
  const [companies, setCompanies] = useState([]);
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [editSymbol, setEditSymbol] = useState(null);

  // GET all companies
  useEffect(() => {
    fetchCompanies();
  }, []);

  function fetchCompanies() {
    fetch('http://localhost:8080/companies')
      .then(res => res.json())
      .then(data => setCompanies(data));
  }

  // POST new company
  function addCompany() {
    fetch('http://localhost:8080/companies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbol, name, price: Number(price) })
    })
      .then(res => res.json())
      .then(() => {
        fetchCompanies();
        setSymbol('');
        setName('');
        setPrice('');
      });
  }

  // PUT update company
  function updateCompany(sym) {
    fetch(`http://localhost:8080/companies/${sym}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, price: Number(price) })
    })
      .then(res => res.json())
      .then(() => {
        fetchCompanies();
        setEditSymbol(null);
        setSymbol('');
        setName('');
        setPrice('');
      });
  }

  // DELETE company
  function deleteCompany(sym) {
    fetch(`http://localhost:8080/companies/${sym}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(() => fetchCompanies());
  }

  function handleEdit(company) {
    setEditSymbol(company.symbol);
    setSymbol(company.symbol);
    setName(company.name);
    setPrice(company.price);
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Companies CRUD App</h1>

      <h2>{editSymbol ? 'Edit Company' : 'Add Company'}</h2>
      <input placeholder="Symbol" value={symbol} onChange={e => setSymbol(e.target.value)} disabled={!!editSymbol} />
      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} />
      {editSymbol ? (
        <button onClick={() => updateCompany(editSymbol)}>Update</button>
      ) : (
        <button onClick={addCompany}>Add</button>
      )}

      <h2>All Companies</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Name</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.map(c => (
            <tr key={c.symbol}>
              <td>{c.symbol}</td>
              <td>{c.name}</td>
              <td>{c.price}</td>
              <td>
                <button onClick={() => handleEdit(c)}>Edit</button>
                <button onClick={() => deleteCompany(c.symbol)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;