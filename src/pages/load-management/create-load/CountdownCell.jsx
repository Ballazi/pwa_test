import React, { useState, useEffect } from "react";

const CountdownCell = ({ bidDate, onTimeOver }) => {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 10,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      // now.setHours(now.getHours() + 3, now.getMinutes() + 25);
      const timeDiff = bidDate - now;

      // Check if bidDate has passed
      if (timeDiff <= 0) {
        clearInterval(intervalId);
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        onTimeOver(); // Invoke the callback when time is over
        return;
      }

      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });
    };

    const intervalId = setInterval(updateCountdown, 1000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [bidDate, onTimeOver]);

  useEffect(() => {
    // Display alert when time is over
    if (
      countdown.days === 0 &&
      countdown.hours === 0 &&
      countdown.minutes === 0 &&
      countdown.seconds === 0
    ) {
      // alert("Time Over");
    }
  }, [countdown]);

  return (
    <span
      style={{
        backgroundColor: "#065AD8",
        color: "white",
        paddingLeft: "10px",
        paddingRight: "10px",
      }}
    >
      {countdown.days === 0 &&
      countdown.hours === 0 &&
      countdown.minutes === 0 &&
      countdown.seconds === 0
        ? "Time Over"
        : `${countdown.days}d ${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s`}
    </span>
  );
};

export default CountdownCell;
