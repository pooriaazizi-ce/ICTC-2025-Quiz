import React, { useState } from 'react';

const COLORS = ['قرمز', 'زرد', 'سبز', 'آبی'];

function App() {
  const [participantId, setParticipantId] = useState(1);
  const [examId, setExamId] = useState(1);
  const [lessonId, setLessonId] = useState(1);
  const [color, setColor] = useState(0);


  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:5000/api/set", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: Number(participantId),
        examId: Number(examId),
        lessonId: Number(lessonId),
        value: Number(color),
      }),
    });
    alert("ثبت شد!");
  };

  const [meanInfo, setMeanInfo] = useState(null);

  const handleGetMean = async () => {
    const res = await fetch(`http://localhost:5000/api/mean?examId=${examId}&lessonId=${lessonId}`);
    const data = await res.json();
    setMeanInfo(data);
  };

  const [topUsers, setTopUsers] = useState([]);
  const [nTop, setNTop] = useState(10);

  // نمایش نفرات برتر یک درس در یک آزمون
  const handleGetTopUsers = async () => {
    const res = await fetch(
      `http://localhost:5000/api/top?examId=${examId}&lessonId=${lessonId}&n=${nTop}`
    );
    const data = await res.json();
    setTopUsers(data.topUsers);
  };

  const [topOverall, setTopOverall] = useState([]);

  const handleGetTopOverall = async () => {
    const res = await fetch(`http://localhost:5000/api/top-overall?n=${nTop}`);
    const data = await res.json();
    setTopOverall(data.top);
  };

  return (
    <div>
      <div style={{ maxWidth: 300, margin: "40px auto", padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
        <h3>ثبت رنگ درس برای شرکت‌کننده</h3>
        <form onSubmit={handleSubmit}>

          <label>شماره شرکت‌کننده: </label>

          <input type="number" min="1" max="100000" value={participantId} onChange={e => setParticipantId(e.target.value)} />
          <br /><br />

          <label>شماره آزمون: </label>
          <input type="number" min="1" max="10" value={examId} onChange={e => setExamId(e.target.value)} />

          <br /><br />

          <label>شماره درس: </label>
          <input type="number" min="1" max="5" value={lessonId} onChange={e => setLessonId(e.target.value)} />

          <br /><br />

          <label>رنگ: </label>
          <select value={color} onChange={e => setColor(Number(e.target.value))}>
            {COLORS.map((col, idx) => <option key={idx} value={idx}>{col}</option>)}
          </select>

          <br /><br />

          <button type="submit">ثبت</button>

        </form>
        <button type="button" onClick={handleGetMean}>
          نمایش میانگین درصد درس انتخاب‌شده
        </button>
        {meanInfo && (
          <div style={{ marginTop: 16 }}>
            <strong>میانگین رنگ: </strong>{meanInfo.mean.toFixed(2)}<br />
            <strong>درصد موفقیت: </strong>{meanInfo.percent.toFixed(2)}
          </div>
        )}
      </div>

      {/* جدول نفرات برتر */}
      <hr />
      <h4>جدول نفرات برتر این درس در این آزمون</h4>
      <label>تعداد نفرات برتر:</label>
      <input
        type="number"
        min="1"
        max="100"
        value={nTop}
        onChange={e => setNTop(Number(e.target.value))}
        style={{ width: 50, marginLeft: 5, marginRight: 10 }}
      />
      <button type="button" onClick={handleGetTopUsers}>
        نمایش نفرات برتر
      </button>
      <ul>
        {topUsers.map(userId => (
          <li key={userId}>شرکت‌کننده شماره {userId}</li>
        ))}
      </ul>

      <hr />
      <h4>جدول نفرات برتر مجموع کل آزمون‌ها</h4>
      <button type="button" onClick={handleGetTopOverall}>
        نمایش نفرات برتر کل آزمون‌ها
      </button>
      <ul>
        {topOverall.map(({ userId, sum }) => (
          <li key={userId}>شرکت‌کننده {userId} (امتیاز: {sum})</li>
        ))}
      </ul>

    </div>


  );

}

export default App;
