import { useEffect } from 'react'

// 滚动到视口时给 .reveal 元素加 .in（触发上浮显现动画）
// key 变化时重新绑定，保证切换视图（首页 / 项目详情）后新出现的元素也能显现
export function useReveal(key = 'default') {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.reveal'))
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -6% 0px' }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [key])
}
