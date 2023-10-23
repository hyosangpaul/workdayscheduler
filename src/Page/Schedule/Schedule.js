import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import * as XLSX from 'xlsx';
import "../../style/schedule/schedule.css";

const Schedule = () => {
    const [leastworker, setLeastworker] = useState(0);
    const [maximumworker, setMaximumworker] = useState(0);
    const [totalday, setTotalday] = useState(0);
    const [totalworker, setTotalworker] = useState(0);
    const [schedule, setSchedule] = useState([]);
    const [showSchedule, setShowSchedule] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  // 스케줄 생성 로직
  useEffect(() => {
    if (showSchedule) {

      // 월에 맞춰서 totalday 생성
      const daysInMonth = new Date(new Date().getFullYear(), selectedMonth, 0).getDate();
      setTotalday(daysInMonth);

      const newSchedule = Array.from({ length: totalworker }, () =>
        Array.from({ length: daysInMonth }, () => Math.random() < 0.5)
      );

      // 각 날짜에 대한 스케줄을 계산
      for (let i = 0; i < daysInMonth; i++) {
        let workingCount = 0;
  
        // 최소 근무자 수 미달 시, 부족한 만큼 근무 일정을 추가
        if (workingCount <= leastworker) {
          for (let j = 0; j < totalworker; j++) {
            if (!newSchedule[j][i] && workingCount < leastworker) {
              newSchedule[j][i] = true;
              workingCount++;
              console.log('workingCount :', workingCount)
            }
          }
        }
  
        // 최대 근무자 수 초과 시, 초과하는 만큼 근무 일정을 삭제
        if (workingCount >= maximumworker) {
          for (let j = 0; j < totalworker; j++) {
            if (newSchedule[j][i] && workingCount > maximumworker) {
              newSchedule[j][i] = false;
              workingCount--;
            }
          }
        }
      }
  
      for (let i = 0; i < totalworker; i++) {
        let consecutiveOffDays = 0;
        let consecutiveWorkingDays = 0;
  
        for (let j = 0; j < daysInMonth; j++) {
          // 연속으로 쉬는 날 조절
          if (!newSchedule[i][j]) {
            consecutiveOffDays++;
  
            if (consecutiveOffDays >= 2 && j + 1 < daysInMonth) {
              newSchedule[i][j + 1] = true;
              consecutiveOffDays = 0;
            }
          } else {
            consecutiveOffDays = 0;
          }
  
          // 연속으로 일하는 날 조절
          if (newSchedule[i][j]) {
            consecutiveWorkingDays++;
  
            if (consecutiveWorkingDays > 4 && j + 1 < daysInMonth) {
              newSchedule[i][j + 1] = false;
              consecutiveWorkingDays = 0;
            }
          } else {
            consecutiveWorkingDays = 0;
          }
        }
      }
      setSchedule(newSchedule);
    } else {
      setSchedule([]);
    }
  }, [totalworker, showSchedule, leastworker, maximumworker, selectedMonth, totalday]);

  // 스케줄 생성 & Validation
  const generateSchedule = () => {
    if (leastworker === 19 && maximumworker === 96) {
      alert("오민영 바보")
      return;
    }
    if (leastworker === 19 && maximumworker === 95) {
      alert("이효상 천재")
      return;
    }
    if (leastworker > maximumworker) {
      alert('최소 출근자가 최대 출근자보다 많습니다.');
      return;
    }
    if (leastworker > totalworker) {
      alert('최소 출근자가 전체 직원보다 많습니다.');
      return;
    }
    if (maximumworker > totalworker) {
      alert('최대 출근자가 전체 직원보다 많습니다.');
      return;
    }
    if (leastworker === 0) {
      alert('최소 출근자가 없습니다.');
      return;
    }
    if (maximumworker === 0) {
      alert('최대 출근자가 없습니다.');
      return;
    }
    if (totalworker === 0) {
      alert('총 직원이 없습니다.');
      return;
    }
    setShowSchedule(true);
  };

  // 스케줄 초기화
  const resetSchedule = () => {
    setSchedule([]);
    setShowSchedule(false);
  };

  // 엑셀 다운로드 로직
  const downloadExcel = (data) => {
    const worksheet = XLSX.utils.aoa_to_sheet([
      ...data.map((workerSchedule, index) =>
        ["직원 " + (index + 1), ...workerSchedule.map(day => day ? "출" : "휴")]
      )
    ]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Schedule');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    saveAsExcelFile(excelBuffer, '정직원 스케줄');
  };
  
  const saveAsExcelFile = (buffer, fileName) => {
    const data = new Blob([buffer], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${fileName}.xlsx`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // 엑셀 다운로드 버튼
  const downloadScheduleAsExcel = () => {
    downloadExcel(schedule);
  };

  return (
    <div className="schedulediv">
      <div>
        <div className="infodiv">
          {/* 최소 출근 인원 */}
          <div className="leastworker">
            일 최소 출근
            <input
              value={leastworker}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value)) {
                  setLeastworker(value);
                }
                setShowSchedule(false);
              }}
              className="leastinput"
            />{" "}
            명
          </div>
          {/* 최대 출근 인원 */}
          <div className="maximumworker">
            일 최대 출근
            <input
              value={maximumworker}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value)) {
                  setMaximumworker(value);
                }
                setShowSchedule(false);
              }}
              className="maximuminput"
            />{" "}
            명
          </div>
          {/* 총 직원 */}
          <div className="totalworker">
            총 직원
            <input
              value={totalworker}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value)) {
                  setTotalworker(value);
                }
                setShowSchedule(false);
              }}
              className="totalworkerinput"
            />{" "}
            명
          </div>
          {/* 월 선택 */}
          <div className="selectedDate">
            이번 달은
            <input
              value={selectedMonth}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value)) {
                  setSelectedMonth(value);
                }
                setShowSchedule(false);
              }}
              className="totalselectedDate"
            />{" "}
            월
          </div>
        </div>
        {/* 버튼 부 */}
        <div className="schedulebtndiv">
          {!showSchedule && (
            <div>
                <button className="howtousebtn" onClick={() => setModalIsOpen(true)}>
                사용방법
                </button>
                <button className="schedulebtn" onClick={generateSchedule}>
                  스케줄 확인
                </button>
            </div>
              )}
          {showSchedule && (
            <div>
                <button className="schedulebtn" onClick={downloadScheduleAsExcel}>
                엑셀 다운받기
                </button>
                <button className="schedulebtn" onClick={resetSchedule}>
                스케줄 초기화
                </button>
            </div>
          )}
        </div>
        <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
          <div className="howtousemodaldiv">
            {/* 모달 내용 */}
            <h1>* 정직원 스케줄 사용 방법 *</h1>
            <br/>
            <p>* 사용방법 *</p>
            <p>1. 일 최소 출근, 일 최대 출근, 총 직원, 이번 달을 적고 스케줄 확인을 누릅니다.</p>
            <p>2. 일 최소 출근과 일 최대 출근은 총 직원보다 많을 수 없습니다.</p>
            <p>3. 스케줄 초기화를 누르고 다시 스케줄 확인을 누르면 설정한 상태 그대로 다시 스케줄을 만들 수 있습니다.</p>
            <p>4. 적당히 마음에 드는 스케줄을 찾으면 수정해서 사용합니다.</p>
            <p>5. 수정이 완료되면 엑셀을 다운받아 사용합니다.</p>
            <br/>
            <p>* 참고한 근무 스케줄 규칙 *</p>
            <p>1. 하루의 최소 출근자는 설정한 수 이상</p>
            <p>2. 하루의 최대 출근자는 설정한 수 이하</p>
            <p>3. 연속 휴무는 최대 2일</p>
            <p>4. 연속 근무는 최대 5일</p>
            <br/>
            <p>* 현재 수정 못한 문제점 *</p>
            <p>1. 숫자를 지우고 처음부터 다시 적으려면 마우스 드래그 하고 숫자를 적어 주세요.</p>
            <p>2. 자잘하게 틀린 경우가 있습니다. 그럴 경우 초기화 및 확인을 눌러 주세요.</p>
            <br/>
          </div>
          <div className="howtousebtndiv" >
            <button className="howtousebtn" onClick={() => setModalIsOpen(false)}>닫기</button>
          </div>
        </Modal>
        {/* 스케줄 */}
        {showSchedule && (
        <div className="schedule">
          {schedule.map((workerSchedule, index) => {
            let totalWorkingDays = 0;
            let totalOffDays = 0;
            return (
              <div key={index}>
                <div className="showschedulediv">
                  <div>{index + 1} : </div>
                  {workerSchedule.map((isWorking, dayIndex) => {
                    if (isWorking) {
                      totalWorkingDays++;
                    } else {
                      totalOffDays++;
                    }
                    return (
                      <select
                        key={dayIndex}
                        className={isWorking ? "working-day" : "off-day"}
                        value={isWorking ? "출" : "휴"}
                        onChange={(e) => {
                          const value = e.target.value;
                          const updatedSchedule = [...schedule];
                          updatedSchedule[index][dayIndex] = value === "출";
                          setSchedule(updatedSchedule);
                        }}
                      >
                        <option value="출">출</option>
                        <option value="휴">휴</option>
                      </select>
                    );
                  })}
                </div>
                <div className="total-days">
                  <div>총 출근 일수: {totalWorkingDays}</div>
                  <div>총 휴무 일수: {totalOffDays}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      </div>
    </div>
  );
}

export default Schedule;