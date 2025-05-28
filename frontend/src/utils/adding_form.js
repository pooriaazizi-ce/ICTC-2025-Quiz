import React, { useState } from 'react';
import '../App.css';


const COLORS = ['قرمز', 'زرد', 'سبز', 'آبی'];

function AddForm() {
    const [participantId, setParticipantId] = useState(1);
    const [examId, setExamId] = useState(1);
    const [lessonId, setLessonId] = useState(1);
    const [color, setColor] = useState(0);
    const [randomStatus, setRandomStatus] = useState(null);


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

    const handleRandomize = async () => {
        setRandomStatus('در حال تولید داده تصادفی...');
        try {
            await fetch('http://localhost:5000/api/randomize', { method: 'POST' });
            setRandomStatus('داده‌ها با موفقیت تصادفی شدند!');
            setTimeout(() => setRandomStatus(null), 3000);
        } catch {
            setRandomStatus('خطا در تولید داده تصادفی!');
            setTimeout(() => setRandomStatus(null), 4000);
        }
    };


    return (
        <div className="section-box1">
            <h3 style={{fontSize: '18px', fontFamily:'Vazirmatn'}}>ثبت رنگ درس برای شرکت‌کننده</h3>
            <form onSubmit={handleSubmit}>

                <label style={{fontSize: '14px', fontFamily:'Vazirmatn'}}>شماره شرکت‌کننده: </label>

                <input style={{fontSize: '14px', fontFamily:'Vazirmatn'}} type="number" min="1" max="100000" value={participantId} onChange={e => setParticipantId(e.target.value)} />
                <br /><br />

                <label style={{fontSize: '14px', fontFamily:'Vazirmatn'}}>شماره آزمون: </label>
                <input style={{fontSize: '14px', fontFamily:'Vazirmatn'}} type="number" min="1" max="10" value={examId} onChange={e => setExamId(e.target.value)} />

                <br /><br />

                <label style={{fontSize: '14px', fontFamily:'Vazirmatn'}}>شماره درس: </label>
                <input style={{fontSize: '14px', fontFamily:'Vazirmatn'}} type="number" min="1" max="5" value={lessonId} onChange={e => setLessonId(e.target.value)} />

                <br /><br />

                <label style={{fontSize: '14px', fontFamily:'Vazirmatn'}}>رنگ: </label>
                <select style={{fontSize: '14px', fontFamily:'Vazirmatn'}} value={color} onChange={e => setColor(Number(e.target.value))}>
                    {COLORS.map((col, idx) => <option key={idx} value={idx}>{col}</option>)}
                </select>

                <br /><br />

                <button  type="submit" style={{fontSize: '14px', fontFamily:'Vazirmatn'}}>ثبت</button>

                <div className="action-row">
                    <button type="button" onClick={handleRandomize} style={{ background: '#0f6e53' , fontSize:'14px', fontFamily:'Vazirmatn' }}>
                        تولید داده تصادفی برای همه
                    </button>
                    {randomStatus && (
                        <span style={{ marginRight: 10, color: '#166534', fontSize: '14px', fontFamily:'Vazirmatn' }}>{randomStatus}</span>
                    )}
                </div>

            </form>
        </div>
    );
}

export default AddForm;
