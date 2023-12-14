import plugin from "tailwindcss/plugin"

const transformWithVars =
  "translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))"

const tailwindUtils = plugin(function ({ addComponents }) {
  addComponents({
    ".row": {
      display: "flex",
      "align-items": "center",
      "flex-direction": "row",
    },
    ".col": {
      display: "flex",
      "align-items": "center",
      "flex-direction": "column",
    },
    ".center": {
      top: "50%",
      left: "50%",
      "--tw-translate-x": "-50%",
      "--tw-translate-y": "-50%",
      transform: transformWithVars,
    },
    ".center-x": {
      left: "50%",
      "--tw-translate-x": "-50%",
      transform: transformWithVars,
    },
    ".center-y": {
      top: "50%",
      "--tw-translate-y": "-50%",
      transform: transformWithVars,
    },
    ".tx-1\\/2": {
      "--tw-translate-x": "50%",
      transform: transformWithVars,
    },
    ".ty-1\\/2": {
      "--tw-translate-y": "50%",
      transform: transformWithVars,
    },
    ".-tx-1\\/2": {
      "--tw-translate-x": "-50%",
      transform: transformWithVars,
    },
    ".-ty-1\\/2": {
      "--tw-translate-y": "-50%",
      transform: transformWithVars,
    },
  })
})

export default tailwindUtils
