import { useEffect, useState } from 'react'

import { projects } from './data.js'
import { useReveal } from './hooks.js'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Experience from './components/Experience.jsx'
import Projects from './components/Projects.jsx'
import Strengths from './components/Strengths.jsx'
import Contact from './components/Contact.jsx'
import ProjectDetail from './components/ProjectDetail.jsx'

// 哈希路由：#project/<slug> 进入项目详情，其它哈希回到首页对应区块
const matchProject = (hash) => /^#project\/([\w-]+)$/.exec(hash)?.[1] || null

export default function App() {
  const [hash, setHash] = useState(() => window.location.hash)

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const slug = matchProject(hash)
  const project = slug ? projects.find((item) => item.slug === slug) : null

  // 路由切换后再滚动：详情页回到顶部，返回首页时滚到对应区块
  useEffect(() => {
    if (project) {
      window.scrollTo({ top: 0, behavior: 'auto' })
      return
    }
    if (hash.length > 1) {
      const el = document.querySelector(hash)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [hash, project])

  useReveal(project ? project.slug : 'home')

  return (
    <>
      <Nav />
      {project ? (
        <ProjectDetail project={project} />
      ) : (
        <>
          <main>
            <Hero />
            <Experience />
            <Projects />
            <Strengths />
          </main>
          <Contact />
        </>
      )}
    </>
  )
}
