export function createCarouselItems(projects) {
  return projects.map((project) => ({
    src: project.cover,
    alt: `${project.title}项目封面`,
    title: project.title,
    subtitle: `${project.index} · ${project.category}`,
  }))
}
