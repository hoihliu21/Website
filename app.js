document.getElementById("registerForm").addEventListener("submit", function (event) {
  event.preventDefault(); // Ngừng gửi form mặc định

  // Lấy giá trị các trường
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // Kiểm tra xem mật khẩu và xác nhận mật khẩu có khớp không
  if (password !== confirmPassword) {
    alert("Mật khẩu và xác nhận mật khẩu không khớp!");
    return;
  }

  // Kiểm tra dữ liệu hợp lệ
  if (username && email && password) {
    alert("Đăng ký thành công!");
    // Thực hiện gửi thông tin đến server (API hoặc Backend)
    // Ở đây bạn có thể sử dụng Fetch API hoặc AJAX để gửi dữ liệu đăng ký đi
  } else {
    alert("Vui lòng điền đầy đủ thông tin.");
  }
});
