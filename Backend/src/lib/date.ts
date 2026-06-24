export function currentMonth(): number {
  const d = new Date()
  return d.getFullYear() * 100 + (d.getMonth() + 1)
}
