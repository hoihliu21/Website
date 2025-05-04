const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Kết nối MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/postDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ Kết nối MongoDB thành công"))
  .catch(err => console.error("❌ Lỗi kết nối MongoDB:", err));

// Định nghĩa Schema & Model
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  link: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});
const Post = mongoose.model("Post", postSchema);

// Mảng giả lập người dùng (có thể thay bằng MongoDB thực tế)
const users = [];

// Đăng ký người dùng
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });

  res.status(201).send("Đăng ký thành công");
});

// Đăng nhập
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);

  if (!user) return res.status(400).send("Người dùng không tồn tại");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).send("Sai mật khẩu");

  const token = jwt.sign({ username: user.username }, 'secretkey', { expiresIn: '1h' });

  res.json({ token });
});

// API: Lấy danh sách bài viết
app.get('/posts', async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

// API: Tạo bài viết
app.post('/posts', async (req, res) => {
  const { title, content, link } = req.body;
  if (!title || !content) return res.status(400).send("Thiếu tiêu đề hoặc nội dung");

  const newPost = new Post({ title, content, link });
  await newPost.save();
  res.status(201).json(newPost);
});

// API: Chỉnh sửa bài viết
app.put('/posts/:id', async (req, res) => {
  const { title, content, link } = req.body;
  const { id } = req.params;

  if (!title || !content) return res.status(400).send("Thiếu tiêu đề hoặc nội dung");

  try {
    const post = await Post.findByIdAndUpdate(id, { title, content, link }, { new: true });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).send("Lỗi chỉnh sửa bài viết");
  }
});

// API: Xóa bài viết
app.delete('/posts/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Post.findByIdAndDelete(id);
    res.status(200).send("Bài viết đã được xóa");
  } catch (error) {
