const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const jsonPath = path.join(__dirname, 'companies.json');

function readCompanies() {
  const data = fs.readFileSync(jsonPath, 'utf-8');
  return JSON.parse(data);
}

function writeCompanies(companies) {
  fs.writeFileSync(jsonPath, JSON.stringify(companies, null, 2));
}

// GET all companies
app.get('/companies', (req, res) => {
  const companies = readCompanies();
  res.json(companies);
});

// GET one company
app.get('/companies/:symbol', (req, res) => {
  const companies = readCompanies();
  const symbolToFind = req.params.symbol.toUpperCase();
  const match = companies.find(c => c.symbol === symbolToFind);
  if (match) {
    res.json(match);
  } else {
    res.status(404).json({ error: `Company '${symbolToFind}' not found.` });
  }
});

// POST create a company
app.post('/companies', (req, res) => {
  const companies = readCompanies();
  const { symbol, name, price } = req.body;
  if (!symbol || !name || price === undefined) {
    return res.status(400).json({ error: 'symbol, name, and price are required.' });
  }
  const exists = companies.find(c => c.symbol === symbol.toUpperCase());
  if (exists) {
    return res.status(409).json({ error: `Company '${symbol.toUpperCase()}' already exists.` });
  }
  const newCompany = { symbol: symbol.toUpperCase(), name, price };
  companies.push(newCompany);
  writeCompanies(companies);
  res.status(201).json({ message: 'Company created.', company: newCompany });
});

// PUT update a company
app.put('/companies/:symbol', (req, res) => {
  const companies = readCompanies();
  const symbolToFind = req.params.symbol.toUpperCase();
  const index = companies.findIndex(c => c.symbol === symbolToFind);
  if (index === -1) {
    return res.status(404).json({ error: `Company '${symbolToFind}' not found.` });
  }
  const { name, price } = req.body;
  if (name !== undefined) companies[index].name = name;
  if (price !== undefined) companies[index].price = price;
  writeCompanies(companies);
  res.json({ message: 'Company updated.', company: companies[index] });
});

// DELETE a company
app.delete('/companies/:symbol', (req, res) => {
  const companies = readCompanies();
  const symbolToFind = req.params.symbol.toUpperCase();
  const index = companies.findIndex(c => c.symbol === symbolToFind);
  if (index === -1) {
    return res.status(404).json({ error: `Company '${symbolToFind}' not found.` });
  }
  const deleted = companies.splice(index, 1)[0];
  writeCompanies(companies);
  res.json({ message: 'Company deleted.', company: deleted });
});

const port = 8080;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});