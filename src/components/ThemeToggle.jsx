import { useEffect, useState } from 'react'

const isWindowContext = typeof window !== "undefined";
const ThemeToggle = () => {
  const [theme, setTheme] = useState() 
  useEffect(() => {
    setTheme(window.theme) 
  })
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    isWindowContext && window.setTheme(newTheme)
    setTheme(newTheme)
  }
  return (
    <div className="theme-toggle" onClick={toggleTheme}>
      {theme === 'light' ? '日' : '夜'}
    </div>
  )
}

export default ThemeToggle
