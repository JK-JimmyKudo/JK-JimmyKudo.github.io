import { profile } from '../data.js'

export default function Contact() {
  return (
    <footer className="contact" id="contact">
      <div className="contact-glow c1" />
      <div className="contact-inner">
        <p className="contact-kicker reveal">Let's create something</p>
        <h2 className="contact-title reveal">
          让好设计，<em>被看见</em>
        </h2>
        <p className="contact-sub reveal">
          正在寻找移动端研发、AI 应用与 AI 产品方向的合作。无论是 App 研发、AI 智能体落地，还是产品从 0 到 1，
          欢迎聊聊你的想法。
        </p>

        <div className="contact-actions reveal">
          <a className="btn btn-solid" href={`mailto:${profile.email}`}>
            发邮件给我
          </a>
          <a className="btn btn-ghost" href="#home">
            回到顶部
          </a>
        </div>

        <a className="contact-mail reveal" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>

        <div className="contact-row reveal">
          <span>{profile.phone}</span>
          <span>·</span>
          <span>{profile.location}</span>
          <span>·</span>
          <a href="#home">个人主页</a>
        </div>
      </div>

      <div className="contact-footer">
        <span>© {new Date().getFullYear()} {profile.name} · 移动端 / AI 应用 / AI 产品</span>
        <span className="top">
          <a href="#home">BACK TO TOP ↑</a>
        </span>
      </div>
    </footer>
  )
}
