const randomGen = (min, max) => {
  return Math.random() * (max - min) + min
}
const keyframesGen = () => [
  {
    transform: 'translateY(0) translateX(0) translateZ(0) rotate3d(0, 0, 0, 0)',
  },
  {
    transform: `translateY(${randomGen(
      0,
      400
    )}px) translateX(2560px) translateZ(${randomGen(
      0,
      200
    )}px) rotate3d(${randomGen(0, 1)}, ${randomGen(0, 1)}, ${randomGen(
      0,
      1
    )}, ${randomGen(-2, 2)}turn)`,
  },
]

const optionGen = () => ({
  iterations: Infinity,
  delay: randomGen(-4000, 4000),
  duration: randomGen(14000, 22000),
})
if (!document.body.animate) {
  console.log('load animate css')
  require('../css/sakura.animate.scss')
  return
}
let petal = document.querySelectorAll('.petal')
for (let i = 0; i < petal.length; i++) {
  this.state.animation[i] = petal[i].animate(keyframesGen(), optionGen())
}
let a = document.querySelectorAll('a')

for (let i = 0; i < a.length; i++) {
  a[i].onmouseenter = this.slowMotion
  a[i].onmouseleave = this.backNormal
  // 移动端用 touchstart touchend
}
