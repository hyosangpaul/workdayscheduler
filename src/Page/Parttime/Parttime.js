import React, { useState } from 'react';
import * as XLSX from "xlsx";
import Modal from "react-modal";
import "../../style/parttime/parttime.css"

const Parttime = () => {
    const [totalworker, setTotalWorker] = useState(0);
    const [worktimes, setWorktimes] = useState([{ time: '', workers: '' }]);
    const [totalDay, setTotalDay] = useState(5);
    const [schedule, setSchedule] = useState({});
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [showSchedule, setShowSchedule] = useState(false);

    const handleWorkTimeChange = (index, key, event) => {
        const newWorktimes = [...worktimes];
        if (key === 'workers' && isNaN(event.target.value)) {
            newWorktimes[index][key] = '';
        } else {
            newWorktimes[index][key] = event.target.value;
        }
        setWorktimes(newWorktimes);
    };

    const handleAddWorkTime = () => {
        setWorktimes([...worktimes, { time: '', workers: '' }]);
    };

    const handleRemoveWorkTime = (index) => {
        if (worktimes.length > 1) {
            const newWorktimes = worktimes.filter((_, idx) => idx !== index);
            setWorktimes(newWorktimes);
        }
    };

    const handleDayChange = (event) => {
        const selectedDay = event.target.value;
        if (selectedDay === '주말') {
            setTotalDay(2);
        } else if (selectedDay === '평일') {
            setTotalDay(5);
        }
    };

    const handleGenerateSchedule = () => {
        const newSchedule = {};
        const totalWorkTime = worktimes.reduce((acc, curr) => acc + parseInt(curr.workers), 0);
        if (totalworker === 0) {
            alert('출근 직원이 0명 입니다.');
            return;
        }
        console.log(worktimes.length)
        if (totalWorkTime > totalworker) {
            alert('인원 수가 총 출근자 수를 초과합니다.');
            return;
        }
        if (totalWorkTime < totalworker) {
            alert('인원 수가 총 출근자 수 미만입니다.');
            return;
        }
        for (let i = 0; i < totalDay; i++) {
            newSchedule[`Day ${i + 1}`] = [];
            let count = 0;
            for (let j = 0; j < worktimes.length; j++) {
                const { time, workers } = worktimes[j];
                for (let k = 0; k < workers; k++) {
                    if (count < totalworker) {
                        newSchedule[`Day ${i + 1}`].push(`${time}`);
                        count++;
                    }
                }
            }
        }
        setSchedule(newSchedule);
        setShowSchedule(true);
    };

        const reGenerateSchedule = () => {
            setSchedule([]);
            setShowSchedule(false);
        }

    // 엑셀 다운로드 로직
    const handleDownloadExcel = () => {
        const workbook = XLSX.utils.book_new();
        const sheetData = [];
        
        const headers = ["직원", ...Object.keys(schedule)];
        sheetData.push(headers);
        
        for (let i = 0; i < totalworker; i++) {
            const dataRow = [`직원 ${i + 1}`];
            for (const [day, scheduleItems] of Object.entries(schedule)) {
            dataRow.push(scheduleItems[i] || "-");
            }
            sheetData.push(dataRow);
        }
        
        const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, "Schedule");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        saveAsExcel(excelBuffer, "계약직 스케줄");
        };

    const saveAsExcel = (buffer, fileName) => {
        const data = new Blob([buffer], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${fileName}.xlsx`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className='parttimemain'>
            <div className='parttime'>
                <div className='workworkers'>
                    <p>출근 직원</p>
                    <input
                        type="number"
                        value={totalworker}
                        onChange={(e) => {
                            setTotalWorker(parseInt(e.target.value))
                            setShowSchedule(false);
                        }}
                    />
                    <p>명</p>
                    <p>주말/평일</p>
                    <select onChange={(e) => {
                        handleDayChange(e)
                        setShowSchedule(false)
                        }}>
                        <option value="평일">평일</option>
                        <option value="주말">주말</option>
                    </select>
                </div>
            </div>
                {worktimes.map((worktime, index) => (
                        <div key={index} className='worktimenumdiv'>
                            <div className='worktimenumcount'>
                                <div>
                                    <p>출근 시간</p>
                                    <input
                                        type="text"
                                        className='worktimenuminput'
                                        value={worktime.time}
                                        onChange={(e) => {
                                            handleWorkTimeChange(index, 'time', e)
                                            setShowSchedule(false)
                                        }}
                                    />
                                    <p>인원 수</p>
                                    <input
                                        type="text"
                                        className='worktimenuminput'
                                        value={worktime.workers}
                                        onChange={(e) => {
                                            handleWorkTimeChange(index, 'workers', e)
                                            setShowSchedule(false)
                                        }}
                                    />
                                    <p>명</p>
                                </div>
                            </div>
                            <div>
                            {worktimes.length > 1 && (
                                <button
                                className='deletebtn'
                                type="button"
                                onClick={() => {
                                    handleRemoveWorkTime(index)
                                    setShowSchedule(false)
                                    }}>
                                    삭제
                                </button>
                            )}
                            </div>
                        </div>
                    ))}
                <div className='addbtndiv'>
                    <button
                    type="button"
                    onClick={(e) =>
                        {
                        handleAddWorkTime(e)
                        setShowSchedule(false)
                    }}>
                    인원 추가하기
                    </button>
                </div>
                <div className='schedulegen'>
                    {showSchedule && (
                        <div className='downloadbtn'>
                            <button type="button" onClick={handleDownloadExcel}>
                                엑셀 다운로드
                            </button>
                            <button type="button" onClick={reGenerateSchedule}>
                                스케줄 초기화
                            </button>
                        </div>
                    )}
                    {!showSchedule && (
                        <div>
                        <button className="howtousebtn" onClick={() => setModalIsOpen(true)}>
                        사용방법
                        </button>
                        <button type="button" onClick={handleGenerateSchedule}>
                        스케줄 확인
                        </button>
                        </div>
                    )}
                </div>
                <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
                <div className="howtousemodaldiv">
                    {/* 모달 내용 */}
                    <h1>* 파트타이머 스케줄 사용 방법 *</h1>
                    <br/>
                    <p>* 사용방법 *</p>
                    <p>1. 출근 직원을 적고 주말/평일을 선택합니다.</p>
                    <p>2. 출근 시간(ex.D,M,N,D1,M1,N1) 과 해당 시간의 인원수를 적습니다.</p>
                    <p>2-1. 출근 직원의 수와 출근 시간 별 인원수의 합은 같아야 합니다.</p>
                    <p>3. 인원 추가하기 버튼으로 출근 시간과 인원수를 추가할 수 있습니다.</p>
                    <p>4. 스케줄 확인을 누릅니다.</p>
                    <p>5. 엑셀을 다운받아 사용합니다.</p>
                    <br/>
                    <p>* 현재 수정 못한 문제점 *</p>
                    <p>1. 출근 시간과 인원 수를 안 적어도 스케줄이 생성 되지만 문제는 없습니다.</p>
                    <p>2. 만약 오류가 생긴 경우 초기화 후 값을 바꾸고 스케줄 확인을 눌러 주세요.</p>
                    <br/>
                </div>
                <div className="howtousebtndiv" >
                    <button className="howtousebtn" onClick={() => setModalIsOpen(false)}>닫기</button>
                </div>
                </Modal>
                {/* 스케줄 */}
                {showSchedule && (
                <div className='partschedule'>
                    <table>
                        <thead>
                            <tr>
                                {Object.keys(schedule).map((day, index) => (
                                    <th key={index}></th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: totalworker }).map((_, workerIndex) => (
                                <tr key={workerIndex}>
                                    <td className='workername'>직원 {workerIndex + 1}</td>
                                    {Object.keys(schedule).map((day) => (
                                        <td key={day} className='worktime'>
                                            {schedule[day][workerIndex] || '-'}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Parttime;
