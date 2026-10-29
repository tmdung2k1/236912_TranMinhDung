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
## 4. Hướng dẫn đóng gói và chạy Backend bằng Docker
- **Docker Hub Backend URL:** `https://hub.docker.com/r/236912tranminhdung/backend`
```bash
# Build image
docker build -t 236912tranminhdung/backend:latest ./backend

# Chạy container với biến môi trường truyền từ bên ngoài
docker run -d -p 5000:5000 -e PORT=5000 -e MONGO_URI="your_mongodb_connection_string" 236912tranminhdung/backend:latest
## 5. Hướng dẫn đóng gói và chạy Frontend bằng Docker
- **Docker Hub Frontend URL:** `https://hub.docker.com/r/tmdung0910/frontend`
```bash
docker build --build-arg VITE_API_URL=http://localhost:5000 -t tmdung0910/frontend:latest ./frontend
docker run -d -p 3000:80 tmdung0910/frontend:latest

## 6. Triển khai Frontend trên Render
- **Tên dịch vụ:** `web-236912`
- **URL Frontend (Link_Render_App):** https://web-236912.onrender.com

## 7. Triển khai Backend API trên Render
- **Tên dịch vụ:** `api-236912`
- **URL Backend API (Link_Render_API):** https://api-236912.onrender.com
- **Health Check Endpoint:** https://api-236912.onrender.com/health
- **Foods API Endpoint:** https://api-236912.onrender.com/api/foods