const db = require('../config/db');


exports.createOrganization = (req, res) => {
  const {
    name, about, tagline, gstin, logo_url, phone, email, website, address_line,
    city, state, country, pin_code, upi_id, bank_account_number, ifsc_code,
    bank_branch, fiscal_year_start, brand_primary_color, brand_accent_color,
    is_active, created_by, updated_by
  } = req.body;

  const query = `
    INSERT INTO organizations 
    (name, about, tagline, gstin, logo_url, phone, email, website, address_line,
    city, state, country, pin_code, upi_id, bank_account_number, ifsc_code,
    bank_branch, fiscal_year_start, brand_primary_color, brand_accent_color,
    is_active, created_at, updated_at, created_by, updated_by) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, ?)
  `;

  const values = [
    name, about, tagline, gstin, logo_url, phone, email, website, address_line,
    city, state, country, pin_code, upi_id, bank_account_number, ifsc_code,
    bank_branch, fiscal_year_start, brand_primary_color, brand_accent_color,
    is_active, created_by, updated_by
  ];

  db.query(query, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Organization created', id: result.insertId });
  });
};


exports.getOrganizations = (req, res) => {
  db.query('SELECT * FROM organizations', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
};


exports.getOrganizationById = (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM organizations WHERE organization_id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ error: 'Organization not found' });
    res.status(200).json(result[0]);
  });
};


exports.updateOrganization = (req, res) => {
  const id = req.params.id;
  const data = req.body;

  
  const fields = [];
  const values = [];

  for (const key in data) {
    fields.push(`${key} = ?`);
    values.push(data[key]);
  }

  fields.push('updated_at = NOW()');  

  const query = `UPDATE organizations SET ${fields.join(', ')} WHERE organization_id = ?`;
  values.push(id);

  db.query(query, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Organization not found' });
    }
    res.status(200).json({ message: 'Organization updated' });
  });
};


exports.deleteOrganization = (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM organizations WHERE organization_id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Organization not found' });
    }
    res.status(200).json({ message: 'Organization deleted' });
  });
};
