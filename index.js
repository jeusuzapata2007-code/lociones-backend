const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const ADMIN_PASSWORD = 'JhonAlonso_Admin_2026';

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.log(err));

const PedidoSchema = new mongoose.Schema({
  nombreCliente: String,
  productos: Array,
  fecha: { type: Date, default: Date.now }
});

const Pedido = mongoose.model('Pedido', PedidoSchema);

app.post('/pedido', async (req, res) => {
  const pedido = new Pedido(req.body);
  await pedido.save();
  res.json({ mensaje: 'Pedido guardado' });
});

app.post('/admin/pedidos', async (req, res) => {
  const { password } = req.body;
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
  }
  const pedidos = await Pedido.find().sort({ fecha: -1 });
  res.json(pedidos);
});

app.listen(process.env.PORT || 4000, () => {
  console.log('Servidor activo');
});
