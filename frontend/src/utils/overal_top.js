import React, { useState } from 'react';
import '../App.css';


function OverallTop() {
    const [nTop, setNTop] = useState(10);

    const [topOverall, setTopOverall] = useState([]);

    const handleGetTopOverall = async () => {
        const res = await fetch(`http://localhost:5000/api/top-overall?n=${nTop}`);
        const data = await res.json();
        setTopOverall(data.top);
    };

    return (
        <div className="section-box">
            <h4 style={{fontSize: '18px', fontFamily:'Vazirmatn'}}>جدول نفرات برتر مجموع کل آزمون‌ها</h4>
            <button style={{fontSize: '14px', fontFamily:'Vazirmatn'}} type="button" onClick={handleGetTopOverall}>
                نمایش نفرات برتر کل آزمون‌ها
            </button>
            <ul>
                {topOverall.map(({ userId, sum }) => (
                    <li style={{fontSize: '14px', fontFamily:'Vazirmatn'}} key={userId}>شرکت‌کننده {userId} (امتیاز: {sum})</li>
                ))}
            </ul>
        </div>
    );
}

export default OverallTop;
