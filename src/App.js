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

  useEffect(() => {
    if (showSchedule) {
      const newSchedule = Array.from({ length: totalworker }, () =>
        Array.from({ length: totalday }, () => Math.random() < 0.5)
      );
      setSchedule(newSchedule);
    } else {
      setSchedule([]);
    }
  }, [totalworker, totalday, showSchedule]);

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
                setLeastworker(e.target.value);
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
                setMaximumworker(e.target.value);
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
                setTotalday(e.target.value);
              }}
              className="totaldayinput"
            />{" "}
            일
          </div>
          {/* 근무 하는 직원 */}
          <div className="totalworker">
            근무 하는 직원
            <input
              value={totalworker}
              onChange={(e) => {
                setTotalworker(e.target.value);
              }}
              className="totalworkerinput"
            />{" "}
            명
          </div>
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