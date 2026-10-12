import { experienceTimeline, stats } from '../data.js'

export default function Experience() {
  return (
    <section className="section journey" id="about">
      <div className="container">
        <div className="journey-layout">
          <div className="journey-intro reveal">
            <span className="journey-kicker">Journey</span>
            <h2 className="journey-title">我的进阶<br />打怪之路</h2>
            <p className="journey-lead">
              从 iOS 原生开发到 Flutter 跨平台，再到医疗 AI 智能体落地。每一步都把解决复杂问题的方法，沉淀成下一阶段的能力。
            </p>

            <div className="journey-stats" aria-label="职业数据">
              {stats.map((item) => (
                <div className="journey-stat" key={item.label}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <ol className="journey-timeline reveal">
            {experienceTimeline.map((item, index) => (
              <li className={`journey-item${index === experienceTimeline.length - 1 ? ' is-latest' : ''}`} key={item.period}>
                <span className="journey-node" aria-hidden="true" />
                <div className="journey-period">{item.period}</div>
                <div className="journey-content">
                  <div className="journey-heading">
                    <h3>{item.company}</h3>
                    <span>{item.role}</span>
                  </div>
                  <p>{item.summary}</p>
                  <div className="journey-tags">
                    {item.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
