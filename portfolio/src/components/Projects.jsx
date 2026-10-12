import { useMemo, useState } from 'react'

import { projects } from '../data.js'
import CircularCarousel from './CircularCarousel.jsx'
import { createCarouselItems } from './circularCarouselItems.js'

export default function Projects() {
  const [activeIndex, setActiveIndex] = useState(0)
  const carouselItems = useMemo(() => createCarouselItems(projects), [])
  const activeProject = projects[activeIndex] || projects[0]

  return (
    <section className="section section-alt" id="work">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">
            <span className="idx">02</span> Selected Works
          </span>
          <h2 className="section-title">
            精选<em>项目</em>
          </h2>
        </div>

        <div className="projects-carousel-shell reveal">
          <div className="projects-carousel-stage">
            <CircularCarousel
              items={carouselItems}
              preset="cylinder"
              intro="rise"
              cardWidth={300}
              aspectRatio={1}
              gap={34}
              speed={10}
              captions
              fadeColor="#0d0d12"
              cornerRadius={18}
              onChange={setActiveIndex}
            />
          </div>

          <article className="project-active" aria-live="polite">
            <div className="project-active-meta">
              <span className="project-active-index">{activeProject.index}</span>
              <span className="project-cat">{activeProject.category}</span>
              <span className="project-active-year">{activeProject.year}</span>
            </div>
            <h3 className="project-active-title">{activeProject.title}</h3>
            <p className="project-active-desc">{activeProject.desc}</p>
            <div className="project-tags">
              {activeProject.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
