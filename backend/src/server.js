// backend/server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();

app.use(cors());
app.use(express.json());

const TOTAL_USERS = 100000;
const TOTAL_EXAMS = 10;
const TOTAL_LESSONS = 5;
const TOTAL_VALUES = TOTAL_USERS * TOTAL_EXAMS * TOTAL_LESSONS; // 5,000,000
const BUFFER_LENGTH = Math.ceil(TOTAL_VALUES / 4); // هر 4 مقدار = 1 بایت
const DATA_FILE = 'data.bin';

// بافر اصلی داده‌ها
let buffer;
if (fs.existsSync(DATA_FILE)) {
  buffer = fs.readFileSync(DATA_FILE);
} else {
  buffer = Buffer.alloc(BUFFER_LENGTH);
  fs.writeFileSync(DATA_FILE, buffer);
}

// تبدیل آدرس داده به اندیس کلی
function index(userId, examId, lessonId) {
  return ((userId - 1) * TOTAL_EXAMS * TOTAL_LESSONS) + ((examId - 1) * TOTAL_LESSONS) + (lessonId - 1);
}

// ست کردن مقدار (۰ تا ۳)
function setValue(userId, examId, lessonId, value) {
  const idx = index(userId, examId, lessonId);
  const byteIdx = Math.floor(idx / 4);
  const bitOffset = (idx % 4) * 2;
  buffer[byteIdx] &= ~(0b11 << bitOffset); // پاک کردن مقدار قبلی
  buffer[byteIdx] |= (value & 0b11) << bitOffset; // مقدار جدید
}

// خواندن مقدار
function getValue(userId, examId, lessonId) {
  const idx = index(userId, examId, lessonId);
  const byteIdx = Math.floor(idx / 4);
  const bitOffset = (idx % 4) * 2;
  return (buffer[byteIdx] >> bitOffset) & 0b11;
}

// ذخیره در فایل
function saveBuffer() {
  fs.writeFileSync(DATA_FILE, buffer);
}

// API: درج مقدار
app.post('/api/set', (req, res) => {
  const { userId, examId, lessonId, value } = req.body;
  if (
    userId < 1 || userId > TOTAL_USERS ||
    examId < 1 || examId > TOTAL_EXAMS ||
    lessonId < 1 || lessonId > TOTAL_LESSONS ||
    value < 0 || value > 3
  ) {
    return res.status(400).json({ error: 'Invalid data' });
  }
  setValue(userId, examId, lessonId, value);
  console.log(`received: userId: ${userId} | examId: ${examId} | lessonId: ${lessonId} | value: ${value}`);
  saveBuffer();
  res.json({ success: true });
});

// API: خواندن مقدار
app.get('/api/get', (req, res) => {
  const { userId, examId, lessonId } = req.query;
  if (
    userId < 1 || userId > TOTAL_USERS ||
    examId < 1 || examId > TOTAL_EXAMS ||
    lessonId < 1 || lessonId > TOTAL_LESSONS
  ) {
    return res.status(400).json({ error: 'Invalid data' });
  }
  const value = getValue(Number(userId), Number(examId), Number(lessonId));
  res.json({ value });
});

app.post('/api/randomize', (req, res) => {
  for (let idx = 0; idx < TOTAL_VALUES; idx++) {
    const val = Math.floor(Math.random() * 4); // بین ۰ تا ۳
    const byteIdx = Math.floor(idx / 4);
    const bitOffset = (idx % 4) * 2;
    buffer[byteIdx] &= ~(0b11 << bitOffset);
    buffer[byteIdx] |= (val & 0b11) << bitOffset;
  }
  saveBuffer();
  res.json({ success: true });
});

app.get('/api/top', (req, res) => {
  const { examId, lessonId, n } = req.query;
  let results = [];

  for (let userId = 1; userId <= TOTAL_USERS; userId++) {
    const value = getValue(userId, Number(examId), Number(lessonId));
    if (value === 3) { // فقط آبی
      results.push(userId);
    }
  }

  // فقط N نفر اول را بده
  results = results.slice(0, Number(n));
  res.json({ topUsers: results });
});

app.get('/api/top-weighted', (req, res) => {
  const { examId, n } = req.query;
  let scores = [];

  for (let userId = 1; userId <= TOTAL_USERS; userId++) {
    let sum = 0;
    for (let lessonId = 1; lessonId <= TOTAL_LESSONS; lessonId++) {
      const value = getValue(userId, Number(examId), lessonId);
      sum += value * lessonId; // ضریب هر درس همان شماره درس است
    }
    scores.push({ userId, sum });
  }

  // مرتب‌سازی نزولی
  scores.sort((a, b) => b.sum - a.sum);

  // N نفر اول
  res.json({ top: scores.slice(0, Number(n)) });
});

// میانگین درصد پاسخ برای یک درس در یک آزمون
app.get('/api/mean', (req, res) => {
  const { examId, lessonId } = req.query;
  let sum = 0;
  for (let userId = 1; userId <= TOTAL_USERS; userId++) {
    sum += getValue(userId, Number(examId), Number(lessonId));
  }
  // بیشترین مقدار ممکن: 3، کمترین: 0
  const mean = sum / TOTAL_USERS; // میانگین رنگ (0 تا 3)
  const percent = (mean / 3) * 100; // درصد نسبت به بهترین مقدار (آبی)
  res.json({ mean, percent });
});

// نفرات برتر مجموع کل آزمون‌ها
app.get('/api/top-overall', (req, res) => {
  const { n } = req.query;
  let scores = [];

  for (let userId = 1; userId <= TOTAL_USERS; userId++) {
    let sum = 0;
    for (let examId = 1; examId <= TOTAL_EXAMS; examId++) {
      for (let lessonId = 1; lessonId <= TOTAL_LESSONS; lessonId++) {
        sum += getValue(userId, examId, lessonId) * lessonId; // رنگ × ضریب درس
      }
    }
    scores.push({ userId, sum });
  }

  scores.sort((a, b) => b.sum - a.sum);
  res.json({ top: scores.slice(0, Number(n)) });
});

// راه‌اندازی سرور
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
