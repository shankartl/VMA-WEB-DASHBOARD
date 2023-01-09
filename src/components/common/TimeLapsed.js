import React from "react";

const TimeLapsed = ({ timestamp = new Date() }) => {
  const calculateTimeLapsed = () => {
    const difference = +new Date() - +new Date(timestamp);
    let timeLapsed = {};
    if (difference > 0) {
      timeLapsed = {
        d: Math.floor(difference / (1000 * 60 * 60 * 24)),
        h: Math.floor((difference / (1000 * 60 * 60)) % 24),
        m: Math.floor((difference / 1000 / 60) % 60),
      };
    }
    return timeLapsed;
  };

  const [timeLeft, setTimeLeft] = React.useState(calculateTimeLapsed());
  const timerComponents = [];

  React.useEffect(() => {
    let interval = setTimeout(() => {
      setTimeLeft(calculateTimeLapsed());
    }, 60000);
    return () => {
      clearInterval(interval);
    };
  });

  Object.keys(timeLeft).forEach((interval, i) => {
    if (!timeLeft[interval]) return;
    timerComponents.push(
      <span key={i}>
        {timeLeft[interval]}
        {interval}{" "}
      </span>
    );
  });
  return <>{timerComponents.length ? timerComponents : <span>Just now!</span>}</>;
};

export default TimeLapsed;
