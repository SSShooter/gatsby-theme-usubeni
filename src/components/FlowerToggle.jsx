import { useState, useEffect } from 'react'

const FlowerToggle = () => {
  const [isFlowerDance, setFlowerDance] = useState(1)
  const toggleLogic = (n) => {
    const sakuraCanvas = document.querySelector('#canvas_sakura')
    if (n == 1 && !sakuraCanvas) {
      import('../sakura.TRHX.js').then((code) => {
        code.default()
      })
    }
    if (sakuraCanvas) sakuraCanvas.style.opacity = Number(n)
    localStorage.setItem('flowerDance', n)
    setFlowerDance(n)
  }
  useEffect(() => {
    let localFlowerDance = localStorage.getItem('flowerDance')
    if (!localFlowerDance) {
      setFlowerDance(0)
    } else {
      setFlowerDance(localFlowerDance)
    }
  })
  const toggleFlowerDance = () => {
    if (isFlowerDance == 1) toggleLogic(0)
    else toggleLogic(1)
  }
  return (
    <div className="flower-toggle" onClick={toggleFlowerDance}>
      {isFlowerDance == 0 ? '隐' : '樱'}
    </div>
  )
}

export default FlowerToggle
