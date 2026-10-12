import { useEffect, useState } from 'react'
import { nav, profile } from '../data.js'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner">
        <a className="nav-logo" href="#home">
          {profile.name}
          <span className="dot" />
        </a>
        <ul className="nav-links">
          {nav.map((n) => (
            <li key={n.id}>
              <a href={`#${n.id}`}>{n.label}</a>
            </li>
          ))}
        </ul>
        <a className="nav-cta" href="#contact">
          联系我
        </a>
      </div>
    </header>
  )
}
