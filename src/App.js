import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import Header from "./page/Header";
import "./App.css";

const App = () => {
  const [leastworker, setLeastworker] = useState(0);
  const [maximumworker, setMaximumworker] = useState(0);
  const [totalday, setTotalday] = useState(0);
  const [totalworker, setTotalworker] = useState(0);
  const [schedule, setSchedule] = useState([]);
  const [showSchedule, setShowSchedule] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

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
              value={leastworker}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value === '' || (value !== '' && !isNaN(value))) {
                  setLeastworker(value === '' ? 0 : parseInt(value));
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
              value={maximumworker}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value === '' || (value !== '' && !isNaN(value))) {
                  setMaximumworker(value === '' ? 0 : parseInt(value));
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
              value={totalday}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value === '' || (value !== '' && !isNaN(value))) {
                  setTotalday(value === '' ? 0 : parseInt(value));
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
              value={totalworker}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value === '' || (value !== '' && !isNaN(value))) {
                  setTotalworker(value === '' ? 0 : parseInt(value));
                }
              }}
              className="totalworkerinput"
            />{" "}
            명
          </div>
        </div>
        <div className="schedulebtndiv">
            <button className="howtousebtn" onClick={() => setModalIsOpen(true)}>
              사용방법
            </button>
            <button className="schedulebtn" onClick={generateSchedule}>스케줄 확인</button>
          {showSchedule && (
            <button className="schedulebtn" onClick={resetSchedule}>
              스케줄 초기화
            </button>
          )}
        </div>
        <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
          <div className="howtousemodaldiv">
            <h1>* 스케줄 자동 배정 시스템 사용 방법 *</h1>
            <br/>
            <p>* 사용방법 *</p>
            <p>1. 일 최소 출근은 일 최대 출근 보다 적을 수 없습니다.</p>
            <p>2. 일 최소 출근과 일 최대 출근은 근무하는 직원보다 많을 수 없습니다.</p>
            <p>3. 이번 달은 28보다 적을 수 없고 31보다 많을 수 없습니다.</p>
            <p>4. 스케줄 확인 후 스케줄 초기화를 누르고 다시 스케줄 확인을 누르면 설정한 상태
            그대로 다시 스케줄을 만들 수 있습니다.
            </p>
            <br/>
            <p>* 참고한 근무 스케줄 규칙 *</p>
            <p>1. 하루의 최소근무자는 설정한 수 이상</p>
            <p>2. 하루의 최대근무자는 설정한 수 이하</p>
            <p>3. 연속 휴무는 최대 2일</p>
            <p>4. 연속 근무는 최대 5일</p>
            <br/>
            <p>* 현재 수정 못한 문제점 *</p>
            <p>1. 숫자를 지우고 처음부터 다시 적으려면 마우스 드래그 하고 숫자적기</p>
            <p>2. 월을 설정하면 자동으로 최대 출근일 나오기 수정 예정</p>
            <p>3. 평일, 주말 반영 수정 예정</p>
            <p>4. 자잘하게 틀린 경우가 있습니다. 그럴 경우 초기화 및 확인</p>
          </div>
          <div className="howtousebtndiv" >
            <button className="howtousebtn" onClick={() => setModalIsOpen(false)}>닫기</button>
          </div>
        </Modal>
        {showSchedule && (
        <div className="schedule">
        {schedule.map((workerSchedule, index) => (
          <div key={index} className="worker-schedule">
            <div className="schedule-label">직원 {index + 1} :</div>
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
