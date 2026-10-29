import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://api-236912.onrender.com';

const initialFormState = {
  foodId: '',
  name: '',
  category: '',
  cuisine: '',
  ingredients: '',
  price: '',
  quantity: '',
  description: '',
  imageUrl: ''
};

function App() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);

  const showNotification = (msg, isError = false) => {
    if (isError) {
      setError(msg);
      setSuccessMsg('');
    } else {
      setSuccessMsg(msg);
      setError('');
    }
    setTimeout(() => {
      setError('');
      setSuccessMsg('');
    }, 4000);
  };

  const fetchFoods = async (search = '') => {
    try {
      setLoading(true);
      const url = search
        ? `${API_BASE_URL}/api/foods?search=${encodeURIComponent(search)}`
        : `${API_BASE_URL}/api/foods`;
      const response = await axios.get(url);
      setFoods(response.data);
    } catch (err) {
      showNotification(err.response?.data?.message || 'Không thể kết nối đến máy chủ Backend!', true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFoods(searchTerm);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        ...formData,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        ingredients: typeof formData.ingredients === 'string'
          ? formData.ingredients.split(',').map(i => i.trim()).filter(Boolean)
          : formData.ingredients
      };

      if (editingId) {
        await axios.put(`${API_BASE_URL}/api/foods/${editingId}`, payload);
        showNotification('Cập nhật món ăn thành công!');
      } else {
        await axios.post(`${API_BASE_URL}/api/foods`, payload);
        showNotification('Thêm món ăn mới thành công!');
      }

      setFormData(initialFormState);
      setEditingId(null);
      fetchFoods(searchTerm);
    } catch (err) {
      showNotification(err.response?.data?.message || 'Có lỗi xảy ra khi lưu món ăn!', true);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (food) => {
    setEditingId(food._id);
    setFormData({
      foodId: food.foodId,
      name: food.name,
      category: food.category,
      cuisine: food.cuisine,
      ingredients: Array.isArray(food.ingredients) ? food.ingredients.join(', ') : '',
      price: food.price,
      quantity: food.quantity,
      description: food.description || '',
      imageUrl: food.imageUrl || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa món "${name}"?`)) return;
    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/api/foods/${id}`);
      showNotification(`Đã xóa món "${name}" thành công!`);
      fetchFoods(searchTerm);
    } catch (err) {
      showNotification(err.response?.data?.message || 'Lỗi khi xóa món ăn!', true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>🍲 Hệ Thống Quản Lý Món Ăn Đám Mây</h1>
        <p>Đề tài thực hành Điện toán đám mây</p>
      </header>

      {error && <div className="alert alert-error">⚠️ {error}</div>}
      {successMsg && <div className="alert alert-success">✅ {successMsg}</div>}

      <div className="main-layout">
        {/* FORM THÊM / CẬP NHẬT */}
        <div className="card form-card">
          <h2>{editingId ? '✏️ Cập Nhật Món Ăn' : '➕ Thêm Món Ăn Mới'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Mã món ăn (foodId) *</label>
              <input name="foodId" value={formData.foodId} onChange={handleInputChange} placeholder="VD: FD004" required />
            </div>
            <div className="form-group">
              <label>Tên món ăn *</label>
              <input name="name" value={formData.name} onChange={handleInputChange} placeholder="VD: Bánh Mì Thịt Nướng" required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Loại món ăn *</label>
                <input name="category" value={formData.category} onChange={handleInputChange} placeholder="Món nước / Món khô" required />
              </div>
              <div className="form-group">
                <label>Vùng miền / Ẩm thực *</label>
                <input name="cuisine" value={formData.cuisine} onChange={handleInputChange} placeholder="Miền Bắc / Trung / Nam" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Giá bán (VNĐ) *</label>
                <input type="number" min="0" name="price" value={formData.price} onChange={handleInputChange} placeholder="35000" required />
              </div>
              <div className="form-group">
                <label>Số lượng *</label>
                <input type="number" min="0" name="quantity" value={formData.quantity} onChange={handleInputChange} placeholder="50" required />
              </div>
            </div>
            <div className="form-group">
              <label>Nguyên liệu (ngăn cách bằng dấu phẩy)</label>
              <input name="ingredients" value={formData.ingredients} onChange={handleInputChange} placeholder="Bánh mì, Thịt nướng, Đồ chua, Ngò..." />
            </div>
            <div className="form-group">
              <label>URL Hình ảnh</label>
              <input name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} placeholder="https://..." />
            </div>
            <div className="form-group">
              <label>Mô tả món ăn</label>
              <textarea name="description" rows="2" value={formData.description} onChange={handleInputChange} placeholder="Mô tả hương vị..." />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {editingId ? 'Lưu Cập Nhật' : 'Thêm Món Ăn'}
              </button>
              {editingId && (
                <button type="button" className="btn btn-secondary" onClick={() => { setEditingId(null); setFormData(initialFormState); }}>
                  Hủy
                </button>
              )}
            </div>
          </form>
        </div>

        {/* DANH SÁCH & TÌM KIẾM */}
        <div className="card list-card">
          <div className="list-header">
            <h2>📋 Danh Sách Món Ăn ({foods.length})</h2>
            <form onSubmit={handleSearch} className="search-bar">
              <input
                type="text"
                placeholder="Tìm tên, loại, vùng miền..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">Tìm kiếm</button>
              <button type="button" className="btn btn-secondary" onClick={() => { setSearchTerm(''); fetchFoods(''); }}>Tất cả</button>
            </form>
          </div>

          {loading ? (
            <div className="loading">⏳ Đang tải dữ liệu...</div>
          ) : foods.length === 0 ? (
            <p className="empty-text">Không tìm thấy món ăn nào.</p>
          ) : (
            <div className="food-grid">
              {foods.map((food) => (
                <div key={food._id} className="food-item">
                  {food.imageUrl && (
                    <img src={food.imageUrl} alt={food.name} className="food-img" onError={(e) => e.target.style.display = 'none'} />
                  )}
                  <div className="food-info">
                    <span className="badge">{food.foodId}</span>
                    <span className="badge badge-cuisine">{food.cuisine}</span>
                    <h3>{food.name}</h3>
                    <p className="category">Phân loại: <strong>{food.category}</strong></p>
                    <p className="price">{Number(food.price).toLocaleString('vi-VN')} đ</p>
                    <p className="qty">Kho: {food.quantity} phần</p>
                    <div className="item-actions">
                      <button className="btn btn-info" onClick={() => setSelectedFood(food)}>Chi tiết</button>
                      <button className="btn btn-warning" onClick={() => handleEdit(food)}>Sửa</button>
                      <button className="btn btn-danger" onClick={() => handleDelete(food._id, food.name)}>Xóa</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MODAL XEM CHI TIẾT */}
      {selectedFood && (
        <div className="modal-overlay" onClick={() => setSelectedFood(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Chi Tiết Món Ăn</h2>
            {selectedFood.imageUrl && <img src={selectedFood.imageUrl} alt={selectedFood.name} className="modal-img" />}
            <p><strong>Mã món ăn:</strong> {selectedFood.foodId}</p>
            <p><strong>Tên món ăn:</strong> {selectedFood.name}</p>
            <p><strong>Loại món:</strong> {selectedFood.category}</p>
            <p><strong>Ẩm thực / Vùng miền:</strong> {selectedFood.cuisine}</p>
            <p><strong>Giá bán:</strong> {Number(selectedFood.price).toLocaleString('vi-VN')} VNĐ</p>
            <p><strong>Số lượng hiện có:</strong> {selectedFood.quantity}</p>
            <p><strong>Nguyên liệu:</strong> {selectedFood.ingredients?.join(', ') || 'Không có thông tin'}</p>
            <p><strong>Mô tả:</strong> {selectedFood.description || 'Không có mô tả'}</p>
            <button className="btn btn-secondary" onClick={() => setSelectedFood(null)}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;