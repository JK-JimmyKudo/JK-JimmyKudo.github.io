// 项目详情页：点击项目名 / 简介后进入，展示项目详情与项目经历
export default function ProjectDetail({ project }) {
  const meta = [
    { label: '分类', value: project.category },
    { label: '时间', value: project.year },
    { label: '角色', value: project.role },
  ].filter((item) => item.value)

  const experience = project.experience || []

  return (
    <main className="detail">
      <div className="container">
        <a className="detail-back reveal" href="#work">
          <span aria-hidden="true">←</span> 返回项目列表
        </a>

        <div className="detail-head reveal">
          <div className="detail-cover">
            <img src={project.cover} alt={`${project.title} 封面`} />
          </div>

          <div className="detail-intro">
            <span className="detail-index">{project.index}</span>
            <h1 className="detail-title">{project.title}</h1>

            <dl className="detail-meta">
              {meta.map((item) => (
                <div key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>

            <div className="project-tags detail-tags">
              {project.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
        </div>

        <section className="detail-section reveal">
          <h2>项目详情</h2>
          <p>{project.desc}</p>
        </section>

        {experience.length > 0 && (
          <section className="detail-section reveal">
            <h2>项目经历</h2>
            <ul className="detail-list">
              {experience.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        <a className="detail-back detail-back-bottom reveal" href="#work">
          <span aria-hidden="true">←</span> 返回项目列表
        </a>
      </div>
    </main>
  )
}
