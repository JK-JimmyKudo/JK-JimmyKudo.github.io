// ============================================================
// 站点内容数据 —— 后续只需改这个文件即可更新网站内容
// 标注「待替换」的项目，等你有真实素材后我来更新
// ============================================================

export const profile = {
  name: '彭围',
  nameEn: 'PENG WEI',
  roles: ['移动端开发工程师', 'AI 应用开发工程师', 'AI 产品经理'],
  location: '北京',
  email: 'pw565731968@163.com',
  phone: '15646560212',
  // 头像占位：换成真实照片后，把 avatar 改成图片路径即可（如 '/images/avatar.jpg'）
  avatar: null,
  intro: [
    '以代码构建体验，以 AI 放大能力，以产品思维交付价值。',
    '我是彭围，一名移动端开发工程师，同时深耕 AI 应用开发与 AI 产品方向，专注从需求到上线的全流程落地。',
    '8 年 iOS 与跨平台研发经验，主导过 10+ 款 App 与 AI 智能体产品，擅长性能优化、架构设计与合规上线。',
  ],
}

export const stats = [
  { value: '8+', label: '年研发经验' },
  { value: '10+', label: '款 App 主导研发' },
  { value: '90%', label: 'Bug 率降低' },
  { value: '25%', label: '团队效率提升' },
]

export const experienceTimeline = [
  {
    period: '2018.08 — 2023.04',
    company: '亚信科技（中国）有限公司',
    role: 'iOS 开发工程师',
    summary: '独立负责北辰会展 iOS 项目全流程研发，完成复杂交互、架构重构与性能优化，并将通用能力沉淀为可复用 SDK。',
    tags: ['iOS 架构', 'MVVM', '性能优化', 'SDK 研发'],
  },
  {
    period: '2023.07 — 2024.06',
    company: '北京海之声科技有限公司',
    role: 'iOS 开发工程师',
    summary: '搭建通用组件库与网络层，打通 Flutter 和原生双向通信，持续优化页面复用、路由、深色模式与多机型体验。',
    tags: ['Flutter 混合开发', '组件化', '网络架构', '多端适配'],
  },
  {
    period: '2024.10 — 2025.12',
    company: '北京联和利泰科技股份有限公司',
    role: 'iOS 开发工程师',
    summary: '从零搭建医疗 AI 应用“智小伴”，完成流式对话、Prompt 调优、健康数据采集及医疗应用合规上线。',
    tags: ['AI 智能体', '医疗健康', 'Prompt 工程', '合规上线'],
  },
  {
    period: '2026.03 — 2026.07',
    company: '天津晨景信息技术有限公司',
    role: 'AI 移动开发工程师',
    summary: '主导医疗 AI 客户端全流程研发，借助 Coze 快速验证智能体业务，并完成康康镜报告解读与多类医疗设备接入。',
    tags: ['AI 应用开发', 'Coze', '智能硬件', '医疗合规'],
  },
]

export const projects = [
  {
    index: '01',
    title: '智小伴 · AI 智能体',
    category: 'AI 应用',
    year: '2024 — 2026',
    desc: '独立主导 iOS 端底层框架搭建与模块化架构设计，负责 AI 智能对话界面核心研发，实现流式通信与文本实时输出；完成血糖、体脂、脉象等医疗健康设备 SDK 适配。',
    tags: ['Swift', 'AI Agent', '医疗健康'],
    cover: '/images/project-ai.svg',
    gradient: 'linear-gradient(135deg, #16223a 0%, #0b1020 55%, #101a33 100%)',
    accent: '#8fb7ff',
  },
  {
    index: '02',
    title: '北辰会展',
    category: '移动端开发',
    year: '2019 — 2021',
    desc: '独立负责项目整体技术架构设计与落地，覆盖项目管理、组织架构、视频交互、IM 聊天四大核心模块；主导 SDK 研发并对外输出，助力业务拓展。',
    tags: ['iOS', 'IM', '架构设计'],
    cover: '/images/project-expo.svg',
    gradient: 'linear-gradient(135deg, #1c162e 0%, #0c0a18 55%, #181230 100%)',
    accent: '#b39aff',
  },
  {
    index: '03',
    title: '康云优家',
    category: '移动端开发',
    year: '2018 — 2020',
    desc: '基于 MVVM 完成全量架构重构，主导物业缴费返现营销活动研发；优化蓝牙门禁开门速度至 900ms，APP 包体积减少 32%，H5 加载速度提升 50%。',
    tags: ['iOS', '蓝牙', '性能优化'],
    cover: '/images/project-home.svg',
    gradient: 'linear-gradient(135deg, #0e2428 0%, #0a1417 55%, #10262c 100%)',
    accent: '#7fe3d0',
  },
]

export const strengths = [
  {
    index: '01',
    title: '移动端开发',
    en: 'Mobile Development',
    icon: 'mobile',
    desc: '精通 Objective-C、Swift，掌握 Flutter 跨平台；深挖系统底层、内存管理与 UI 渲染，专注性能与稳定性调优。',
    items: ['iOS 原生开发（OC / Swift）', 'Flutter 跨平台落地', '性能与稳定性调优', '组件化与架构重构'],
  },
  {
    index: '02',
    title: 'AI 应用开发',
    en: 'AI App Development',
    icon: 'ai',
    desc: '将 AI 智能体能力落地到真实产品：流式对话、多主题适配、智能硬件 SDK 集成，用工程能力放大 AI 价值。',
    items: ['AI 智能体对话（流式输出）', 'AI SDK 集成与适配', '智能硬件数据采集解析', 'AIGC 应用实践'],
  },
  {
    index: '03',
    title: 'AI 产品',
    en: 'AI Product',
    icon: 'product',
    desc: '以产品思维串联需求与技术：从需求拆解、技术选型到研发推进、合规上线，保障项目高质量交付。',
    items: ['需求拆解与技术选型', '全流程项目管理', '应用审核与隐私合规', '跨团队协作赋能'],
  },
]

export const nav = [
  { id: 'home', label: '首页' },
  { id: 'about', label: '经历' },
  { id: 'work', label: '项目' },
  { id: 'strengths', label: '优势' },
  { id: 'contact', label: '联系' },
]
