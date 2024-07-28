const express = require('express');
const multer = require('multer');
const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const port = 5000; // 使用 5000 端口

// 配置 Multer
const upload = multer({ dest: 'uploads/' });

// 启用 CORS
app.use(cors());

// 提供静态文件服务
app.use(express.static('public'));

// 上传 PDF 文件到 IPFS
app.post('/upload_pdf', upload.single('file'), async (req, res) => { // 确认字段名为 'file'
  if (!req.file) {
    console.error('No file uploaded');
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const filePath = path.join(__dirname, req.file.path);
    const fileData = await fs.readFile(filePath);
    
    const formData = new FormData();
    formData.append('file', fileData, { filename: req.file.originalname });

    const response = await fetch('http://127.0.0.1:5001/api/v0/add', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`IPFS upload failed: ${response.statusText}`);
    }

    const result = await response.json();

    // 删除临时文件
    await fs.unlink(filePath);

    res.json({ ipfs_hash: result.Hash });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'File upload failed', details: error.message });
  }
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'An unexpected error occurred',
    details: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
