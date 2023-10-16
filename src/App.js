import React, { useState, useEffect } from "react";
import Header from "./page/Header";
import "./app.css";

const App = () => {
  const [leastworker, setLeastworker] = useState(0);
  const [maximumworker, setMaximumworker] = useState(0);
  const [totalday, setTotalday] = useState(0);
  const [totalworker, setTotalworker] = useState(0);
  const [schedule, setSchedule] = useState([]);
  const [showSchedule, setShowSchedule] = useState(false);

  // 근무 스케쥴 규칙
  // 1. 하루의 최소근무자 (leastworker) 는 반드시 설정한 수 이상
  // 2. 하루의 최대근무자 (totalworker) 는 반드시 설정한 수 이하
  // 3. 연속 휴무는 최대 2일

  useEffect(() => {
    if (showSchedule) {
      const newSchedule = Array.from({ length: totalworker }, () =>
        Array.from({ length: totalday }, () => Math.random() < 0.5)
      );
  
      // 각 날짜에 대한 스케줄을 계산
      for (let i = 0; i < totalday; i++) {
        let workingCount = 0;
        for (let j = 0; j < totalworker; j++) {
          if (newSchedule[j][i]) {
            workingCount++;
          }
        }
  
        // 최소 근무자 수 미달 시, 부족한 만큼 근무 일정을 추가
        if (workingCount < leastworker) {
          for (let j = 0; j < leastworker - workingCount; j++) {
            for (let k = 0; k < totalworker; k++) {
              if (!newSchedule[k][i] && workingCount < leastworker) {
                newSchedule[k][i] = true;
                workingCount++;
              }
            }
          }
        } 
        // 최대 근무자 수 초과 시, 초과하는 만큼 근무 일정을 삭제
        else if (workingCount > maximumworker) {
          for (let j = 0; j < workingCount - maximumworker; j++) {
            for (let k = 0; k < totalworker; k++) {
              if (newSchedule[k][i] && workingCount > maximumworker) {
                newSchedule[k][i] = false;
                workingCount--;
              }
            }
          }
        }
      }
  
      // 연속으로 쉬는 날 조절
      for (let i = 0; i < totalworker; i++) {
        let consecutiveOffDays = 0;
        for (let j = 0; j < totalday; j++) {
          if (!newSchedule[i][j]) {
            consecutiveOffDays++;
            // 연속으로 쉬는 날은 2일
            if (consecutiveOffDays >= 2) {
              if (j + 1 < totalday) {
                newSchedule[i][j + 1] = true;
                consecutiveOffDays = 0;
              }
            }
          } else {
            consecutiveOffDays = 0;
          }
        }
      }

      // 연속으로 일하는 날 제한
      for (let i = 0; i < totalworker; i++) {
        let consecutiveWorkingDays = 0;
        for (let j = 0; j < totalday; j++) {
          if (newSchedule[i][j]) {
            consecutiveWorkingDays++;
            // 연속으로 일하는 날이 5일을 초과하는 경우
            if (consecutiveWorkingDays > 4) {
              if (j + 1 < totalday) {
                newSchedule[i][j + 1] = false;
                consecutiveWorkingDays = 0;
              }
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
  }, [totalworker, totalday, showSchedule, leastworker, maximumworker]);

  // 스케줄 생성 버튼
  const generateSchedule = () => {
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
    if (totalday > 31) {
      alert('총 날짜는 31일보다 많을 수 없습니다.');
      return;
    }
    if (totalday < 28) {
      alert('총 날짜는 28일보다 적을 수 없습니다.');
      return;
    }
    setShowSchedule(true);
  };

  const resetSchedule = () => {
    setSchedule([]);
    setShowSchedule(false);
  };

  return (
    <div>
      <Header />
      <div>
        <div className="infodiv">
          {/* 최소 출근 인원 */}
          <div className="leastworker">
            일 최소 출근
            <input
              type="number"
              value={leastworker}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value)) {
                  setLeastworker(value);
                }
              }}
              className="leastinput"
            />{" "}
            명
          </div>
          {/* 최대 출근 인원 */}
          <div className="maximumworker">
            일 최대 출근
            <input
              type="number"
              value={maximumworker}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value)) {
                  setMaximumworker(value);
                }
              }}
              className="maximuminput"
            />{" "}
            명
          </div>
          {/* 총 날짜 */}
          <div className="totalday">
            이번 달은 총
            <input
              type="number"
              value={totalday}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value)) {
                  setTotalday(value);
                }
              }}
              className="totaldayinput"
            />{" "}
            일
          </div>
          {/* 근무하는 직원 */}
          <div className="totalworker">
            근무하는 직원
            <input
              type="number"
              value={totalworker}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value)) {
                  setTotalworker(value);
                }
              }}
              className="totalworkerinput"
            />{" "}
            명
          </div>
        </div>
        <div className="schedulebtndiv">
          <button className="schedulebtn" onClick={generateSchedule}>스케줄 확인</button>
          {showSchedule && (
            <button className="schedulebtn" onClick={resetSchedule}>
              스케줄 초기화
            </button>
          )}
        </div>
        {showSchedule && (
        <div className="schedule">
          {schedule.map((workerSchedule, index) => (
            <div key={index} className="worker-schedule">
              직원 {index + 1} :
              {workerSchedule.map((isWorking, dayIndex) => (
                <div
                  key={dayIndex}
                  className={isWorking ? "working-day" : "off-day"}
                >
                  {isWorking ? "출" : "휴"}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
};

export default App;
