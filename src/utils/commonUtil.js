import swal from "sweetalert2";
import {
  DRUMS,
  DRUMS_POST_COURSE_PRACTICAL,
  DRUMS_POST_COURSE_THEORY,
  DRUMS_PRE_COURSE_THEORY,
  DRUMS_SURVEY_COURSE_THEORY,
  GUITAR,
  GUITAR_POST_COURSE_PRACTICAL,
  GUITAR_POST_COURSE_THEORY,
  GUITAR_PRE_COURSE_THEORY,
  GUITAR_SURVEY_COURSE_THEORY,
} from "../constants/common";

export function pff(key, prefix) {
  if (prefix) {
    return `${prefix}.${key}`;
  }

  return key;
}

export const indianCurrencyText = (amount = "0") =>
  Number(amount).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });

export const roundDecimal = (number = 0) => {
  return Math.round(number * 100) / 100;
};

export const optionsMap = (options) => options.map((o) => ({ label: o, value: o }));

export const filterObject = (obj, filter, filterValue) =>
  Object.keys(obj).reduce((acc, val) => (obj[val][filter] === filterValue ? { ...acc, [val]: obj[val] } : acc), {});

export const alert = (props) => {
  return swal.fire({
    customClass: {
      confirmButton: "swal2-confirm",
      cancelButton: "swal2-cancel",
    },
    title: "Saved!",
    text: "",
    icon: "success",
    confirmButtonColor: "#065BAA",
    confirmButtonText: "Okay",
    ...props,
  });
};

export function toTitleCase(str) {
  const transformedStr = str
    .split(" ")
    .map((w) => w[0]?.toUpperCase() + w.substring(1).toLowerCase())
    .join(" ");

  return transformedStr;
}

export const getSession = (session) => {
  switch (session) {
    case GUITAR:
      return GUITAR_PRE_COURSE_THEORY;
    case DRUMS:
      return DRUMS_PRE_COURSE_THEORY;
    default:
      return GUITAR_PRE_COURSE_THEORY;
  }
};

export const getPostLessonSession = (session) => {
  switch (session) {
    case GUITAR:
      return { theory: GUITAR_POST_COURSE_THEORY, practical: GUITAR_POST_COURSE_PRACTICAL };
    case DRUMS:
      return { theory: DRUMS_POST_COURSE_THEORY, practical: DRUMS_POST_COURSE_PRACTICAL };
    default:
      return { theory: GUITAR_POST_COURSE_THEORY, practical: GUITAR_POST_COURSE_PRACTICAL };
  }
};

export const getSurveyAssessmentId = (session) => {
  switch (session) {
    case GUITAR:
      return GUITAR_SURVEY_COURSE_THEORY;
    case DRUMS:
      return DRUMS_SURVEY_COURSE_THEORY;
    default:
      return GUITAR_SURVEY_COURSE_THEORY;
  }
};
