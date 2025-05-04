 <script>
    const form = document.getElementById('postForm');
    const postsContainer = document.getElementById('postsContainer');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const editForm = document.getElementById('editForm');

    let editingPostId = null;
    let token = localStorage.getItem('token');

    async function loadPosts() {
      const res = await fetch('http://localhost:3000/posts');
      const posts = await res.json();
      postsContainer.innerHTML = '';
      posts.forEach(post => {
        const postEl = document.createElement('div');
        postEl.className = 'post';
        postEl.innerHTML = `
          <h3>${post.title}</h3>
          <p>${post.content}</p>
          ${post.link ? `<p><a href="${post.link}" target="_blank">🔗 Xem liên kết</a></p>` : ''}
          <button onclick="deletePost('${post._id}')">Xóa</button>
          <button onclick="showEditForm(${JSON.stringify(post)})">Chỉnh sửa</button>
        `;
        postsContainer.appendChild(postEl);
      });
    }

    async function deletePost(id) {
      await fetch(`http://localhost:3000/posts/${id}`, { method: 'DELETE' });
      loadPosts();
    }

    function showEditForm(post) {
      document.getElementById('editForm').style.display = 'block';
      document.getElementById('editTitle').value = post.title;
      document.getElementById('editContent').value = post.content;
      document.getElementById('editLink').value = post.link;
      editingPostId = post._id;
    }

    document.getElementById('editForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('editTitle').value;
      const content = document.getElementById('editContent').value;
      const link = document.getElementById('editLink').value;

      await fetch(`http://localhost:3000/posts/${editingPostId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, link })
      });

      loadPosts();
      document.getElementById('editForm').reset();
      document.getElementById('editForm').style.display = 'none';
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('title').value;
      const content = document.getElementById('content').value;
      const link = document.getElementById('link').value;

      await fetch('http://localhost:3000/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title, content, link })
      });

      form.reset();
      loadPosts();
    });

    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('loginUsername').value;
      const password = document.getElementById('loginPassword').value;

      const res = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      localStorage.setItem('token', data.token);
      token = data.token;
      alert('Đăng nhập thành công!');
    });

    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('registerUsername').value;
      const password = document.getElementById('registerPassword').value;

      await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      alert('Đăng ký thành công!');
    });

    loadPosts();
  </script>
