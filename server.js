const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const organizationRoutes = require('./routes/organizationRoutes');

dotenv.config();

const app = express(); // move this up

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/organizations', organizationRoutes); // now this is fine

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
