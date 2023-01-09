import { theme as chakraTheme } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import { createBreakpoints } from "@chakra-ui/theme-tools";

const fonts = {
  ...chakraTheme.fonts,
  body: `"Intel", "Ubuntu", sans-serif, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans,
  Helvetica Neue, sans-serif;`,
  heading: `"Intel", "Ubuntu", sans-serif, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans,
  Helvetica Neue, sans-serif;`,
};

const breakpoints = createBreakpoints({
  sm: "40em",
  md: "52em",
  lg: "64em",
});

const overrides = {
  ...chakraTheme,

  fonts,
  breakpoints,
  fontWeights: {
    normal: 300,
    semiMd: 550,
    medium: 600,
    bold: 700,
  },
  fontSizes: {
    xxxs: "8px",
    xxs: "10px",
    xs: "12px",
    sm: "14px",
    md: "16px",
    lg: "18px",
    xl: "20px",
    "1xl": "22px",
    "2xl": "24px",
    "3xl": "28px",
    "4xl": "36px",
    "5xl": "48px",
    "6xl": "64px",
  },
  colors: {
    primary: { 500: "#143037" },
    secondary: "#03C7FD",
    tertiary: "#EBEBEB",
    darkBlue: { 500: "#065BAA" },
    intelPurple: { 500: "#3A416F" },
    purple: { 500: "#8348CF" },
    lightorange: "#FDEFEC",
    orange: "#EB5A3C",
    dark: "#0F2837",
    darkred: "#B51A33",
    lightGrey: "#F7F7F7",
    greyBox: "#EEF0F0",
    lightGreen: "#54C781",
    linearGray: "#c6c3c340",
    black: "#000000",
    white: "#FFFFFF",
  },
};

const customTheme = extendTheme(overrides);

export default customTheme;
