import { format, millisecondsToHours, millisecondsToMinutes, millisecondsToSeconds } from "date-fns";
import formatDistance from "date-fns/formatDistance";
import React from "react";

export const DateFormat = (props) => {
  return <>{props.data ? format(new Date(props.data), "do LLLL yy") : ""}</>;
};

export const TimeFormat = (props) => {
  return <>{props.data ? format(new Date(props.data), "h:mm a") : ""}</>;
};

export const convertMilliSecondsToHours = (milliSeconds) => {
  if (typeof milliSeconds === "number") {
    return millisecondsToHours(new Date(milliSeconds));
  } else {
    return milliSeconds;
  }
};

export const convertMilliSecondsToMinutes = (milliSeconds) => {
  if (typeof milliSeconds === "number") {
    return millisecondsToMinutes(milliSeconds);
  } else {
    return milliSeconds;
  }
};

export const digitalTime = (milliSeconds) => {
  const convertToHours = convertMilliSecondsToHours(milliSeconds);
  const convertToMinutes = convertMilliSecondsToMinutes(milliSeconds);

  if (convertToHours > 0) {
    return `${convertToHours} hrs`;
  } else if (milliSeconds === 0) {
    return milliSeconds;
  } else {
    return `${convertToMinutes} mins`;
  }
};

export const convertSecondsToMinutes = (seconds) => {
  return formatDistance(0, seconds * 1000, { includeSeconds: true });
};
