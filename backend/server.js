require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Food = require('./models/Food');
const seedData = require('./seed-data.json');

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối MongoDB Atlas & Tự động tạo 3 bản ghi mẫu nếu DB trống
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB Atlas');
    const count = await Food.countDocuments();
    if (count === 0) {
      await Food.insertMany(seedData);
      console.log('✅ Seeded 3 initial food records into collection foods');
    }
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });

// 1. Endpoint kiểm tra trạng thái hoạt động (Health Check)
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  res.status(200).json({
    status: 'OK',
    message: 'Backend API is running',
    database: dbStatus,
    timestamp: new Date()
  });
});

// 2. Lấy danh sách món ăn & Tìm kiếm theo từ khóa (?search=...)
app.get('/api/foods', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query = {
        $or: [
          { foodId: regex },
          { name: regex },
          { category: regex },
          { cuisine: regex },
          { description: regex }
        ]
      };
    }

    const foods = await Food.find(query).sort({ createdAt: -1 });
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ khi lấy danh sách món ăn', error: error.message });
  }
});

// Hàm phụ trợ tìm theo _id của MongoDB hoặc theo foodId
const findFoodByIdOrCode = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    const food = await Food.findById(id);
    if (food) return food;
  }
  return await Food.findOne({ foodId: id });
};

// 3. Xem chi tiết một món ăn
app.get('/api/foods/:id', async (req, res) => {
  try {
    const food = await findFoodByIdOrCode(req.params.id);
    if (!food) {
      return res.status(404).json({ message: 'Không tìm thấy món ăn' });
    }
    res.status(200).json(food);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy thông tin món ăn', error: error.message });
  }
});

// 4. Thêm món ăn mới
app.post('/api/foods', async (req, res) => {
  try {
    const { foodId, name, category, cuisine, ingredients, price, quantity, description, imageUrl } = req.body;

    // Validate dữ liệu đầu vào
    if (!foodId || !name || !category || !cuisine || price === undefined || quantity === undefined) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ các trường bắt buộc: foodId, name, category, cuisine, price, quantity' });
    }

    if (Number(price) < 0 || Number(quantity) < 0) {
      return res.status(400).json({ message: 'Giá bán và số lượng không được nhỏ hơn 0' });
    }

    // Kiểm tra trùng foodId
    const existingFood = await Food.findOne({ foodId: foodId.trim() });
    if (existingFood) {
      return res.status(409).json({ message: `Mã món ăn '${foodId}' đã tồn tại!` });
    }

    const parsedIngredients = Array.isArray(ingredients)
      ? ingredients
      : typeof ingredients === 'string' && ingredients.trim() !== ''
        ? ingredients.split(',').map(i => i.trim()).filter(Boolean)
        : [];

    const newFood = new Food({
      foodId: foodId.trim(),
      name: name.trim(),
      category: category.trim(),
      cuisine: cuisine.trim(),
      ingredients: parsedIngredients,
      price: Number(price),
      quantity: Number(quantity),
      description: description || '',
      imageUrl: imageUrl || ''
    });

    const savedFood = await newFood.save();
    res.status(201).json(savedFood);
  } catch (error) {
    res.status(400).json({ message: 'Dữ liệu không hợp lệ', error: error.message });
  }
});

// 5. Cập nhật thông tin món ăn
app.put('/api/foods/:id', async (req, res) => {
  try {
    const food = await findFoodByIdOrCode(req.params.id);
    if (!food) {
      return res.status(404).json({ message: 'Không tìm thấy món ăn để cập nhật' });
    }

    const { foodId, name, category, cuisine, ingredients, price, quantity, description, imageUrl } = req.body;

    // Nếu đổi foodId, kiểm tra xem foodId mới có bị trùng với món khác không
    if (foodId && foodId.trim() !== food.foodId) {
      const duplicate = await Food.findOne({ foodId: foodId.trim() });
      if (duplicate) {
        return res.status(409).json({ message: `Mã món ăn '${foodId}' đã tồn tại ở món khác!` });
      }
      food.foodId = foodId.trim();
    }

    if (price !== undefined && Number(price) < 0) {
      return res.status(400).json({ message: 'Giá bán không hợp lệ' });
    }
    if (quantity !== undefined && Number(quantity) < 0) {
      return res.status(400).json({ message: 'Số lượng không hợp lệ' });
    }

    if (name !== undefined) food.name = name.trim();
    if (category !== undefined) food.category = category.trim();
    if (cuisine !== undefined) food.cuisine = cuisine.trim();
    if (price !== undefined) food.price = Number(price);
    if (quantity !== undefined) food.quantity = Number(quantity);
    if (description !== undefined) food.description = description;
    if (imageUrl !== undefined) food.imageUrl = imageUrl;

    if (ingredients !== undefined) {
      food.ingredients = Array.isArray(ingredients)
        ? ingredients
        : typeof ingredients === 'string'
          ? ingredients.split(',').map(i => i.trim()).filter(Boolean)
          : food.ingredients;
    }

    const updatedFood = await food.save();
    res.status(200).json(updatedFood);
  } catch (error) {
    res.status(400).json({ message: 'Lỗi cập nhật món ăn', error: error.message });
  }
});

// 6. Xóa món ăn
app.delete('/api/foods/:id', async (req, res) => {
  try {
    const food = await findFoodByIdOrCode(req.params.id);
    if (!food) {
      return res.status(404).json({ message: 'Không tìm thấy món ăn để xóa' });
    }
    await Food.deleteOne({ _id: food._id });
    res.status(200).json({ message: 'Đã xóa món ăn thành công', deletedFood: food });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa món ăn', error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});