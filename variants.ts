export const fallingBlock = {
  hidden: { opacity: 0, y: -100 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 100 },
}
export const flyingBlock = {
  hidden: { opacity: 0, y: 100 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -100 },
}
export const animationStates = {
  initial: "hidden",
  animate: "visible",
  exit: "exit",
}
