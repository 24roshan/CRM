const getUsers = (req, res) => {
  res.json([
    { id: 1, name: 'Roshan' },
    { id: 2, name: 'User 2' },
  ]);
};

module.exports = { getUsers };
