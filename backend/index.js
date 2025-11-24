const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors()); // 启用 CORS
app.use(express.json()); // 解析 JSON 请求体

app.get('/', (req, res) => {
  res.send('RealWorld Backend is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});