import React, { useState } from 'react';

const COLORS = ['قرمز', 'زرد', 'سبز', 'آبی'];

function App() {
  const [participantId, setParticipantId] = useState(1);
  const [examId, setExamId] = useState(1);
  const [lessonId, setLessonId] = useState(1);
  const [color, setColor] = useState(0);


  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`ثبت رنگ: شرکت‌کننده ${participantId}، آزمون ${examId}، درس ${lessonId}، رنگ ${COLORS[color]}`);
    // اینجا باید به بک‌اند ارسال شود
  };

  return (
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
    </div>
  );

}

export default App;
