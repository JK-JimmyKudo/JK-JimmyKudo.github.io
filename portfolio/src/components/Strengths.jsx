import { strengths } from '../data.js'
import { MobileIcon, AiIcon, ProductIcon } from '../icons.jsx'

const icons = {
  mobile: <MobileIcon />,
  ai: <AiIcon />,
  product: <ProductIcon />,
}

export default function Strengths() {
  return (
    <section className="section" id="strengths">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">
            <span className="idx">03</span> Strengths
          </span>
          <h2 className="section-title">
            我的<em>优势</em>
          </h2>
        </div>

        <div className="strength-grid">
          {strengths.map((s) => (
            <article className="strength-card reveal" key={s.index}>
              <div className="strength-top">
                <span className="strength-icon">{icons[s.icon]}</span>
                <span className="strength-idx">{s.index}</span>
              </div>
              <h3 className="strength-title">{s.title}</h3>
              <div className="strength-en">{s.en}</div>
              <p className="strength-desc">{s.desc}</p>
              <ul className="strength-items">
                {s.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
