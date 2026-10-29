# Hệ Thống Quản Lý Món Ăn Trên Nền Tảng Đám Mây

- **Họ và tên:** Trần Minh Dững
- **MSSV:** 236912
- **Lớp:** DH23TIN08

## 1. Giới thiệu đề tài & Công nghệ sử dụng
Hệ thống quản lý danh mục món ăn trực tuyến triển khai trên nền tảng đám mây:
- **Frontend:** React (Vite), Axios, CSS3
- **Backend:** Node.js, Express.js, Mongoose, CORS, Dotenv
- **Cơ sở dữ liệu:** MongoDB Atlas (Database: `236912_TranMinhDung`, Collection: `foods`)
- **Đóng gói & Triển khai:** Docker, Docker Hub, Render PaaS

## 2. Cấu trúc thư mục dự án
```text
236912_TranMinhDung/
├── backend/            # Mã nguồn REST API (Node.js + Express)
├── frontend/           # Mã nguồn Giao diện người dùng (React + Vite)
├── .gitignore          # Loại trừ node_modules và tệp .env bảo mật
└── README.md           # Tài liệu hướng dẫn cài đặt và triển 
- cách cài đặt và chạy chương trình:
+ chạy backend
cd backend
npm install
# Tạo file .env dựa trên .env.example và điền MONGO_URI
npm start

+chạy frontend
cd frontend
npm install
npm run dev