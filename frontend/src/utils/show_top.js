import React, { useState } from 'react';
import '../App.css';


function ShowTop() {
    const [examId, setExamId] = useState(1);
    const [lessonId, setLessonId] = useState(1);
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

    return (
        <div className="section-box">
            <h4 style={{fontSize: '18px', fontFamily:'Vazirmatn'}}>جدول نفرات برتر این درس در این آزمون</h4>

            <div style={{ display: "flex", alignItems: 'center', gap: '8px', fontSize: '14px', fontFamily:'Vazirmatn'}}>
                <label style={{fontSize: '14px', fontFamily:'Vazirmatn'}}>تعداد نفرات برتر:</label>
                <input
                    type="number"
                    min="1"
                    max="9999"
                    value={nTop}
                    onChange={e => setNTop(Number(e.target.value))}
                    style={{ width: 70, marginLeft: 5, marginRight: 10, fontSize: '14px', fontFamily:'Vazirmatn'}}
                />
                <button style={{fontSize: '14px', fontFamily:'Vazirmatn'}} type="button" onClick={handleGetTopUsers}>
                    نمایش نفرات برتر
                </button>
            </div>

            <ul style={{fontSize: '14px', fontFamily:'Vazirmatn'}}>
                {topUsers.map(userId => (
                    <li key={userId}>شرکت‌کننده شماره {userId}</li>
                ))}
            </ul>
        </div>
    );
}

export default ShowTop;
