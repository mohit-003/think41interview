const express = require('express');
const app = express();
const PORT = 3000;
const cors = require('cors');

// Middleware
app.use(express.json());


app.use(cors());

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/order-items', require('./routes/orderItems'));
app.use('/api/inventory-items', require('./routes/inventoryItems'));
app.use('/api/distribution-centers', require('./routes/distributionCenters'));

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
