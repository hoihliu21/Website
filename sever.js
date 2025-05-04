const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

let posts = []; // Lưu trong RAM (mất khi restart)

app.get('/posts', (req, res) => {
  res.json(posts);
});

app.post('/posts', (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).send("Thiếu tiêu đề hoặc nội dung");

  const post = { id: Date.now(), title, content };
  posts.unshift(post);
  res.status(201).json(post);
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
