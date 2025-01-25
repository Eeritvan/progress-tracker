export const generateDates = () => {
  const dates = []
  const today = new Date()

  const startDate = new Date(today)
  const emptyDaysAtStart = (
    new Date(startDate.setDate(startDate.getDate() - 181)).getDay() + 6) % 7

  for (let i = 181-(7-emptyDaysAtStart); i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    dates.push(date)
  }

  for (let i = 1; i <= 7-emptyDaysAtStart; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    dates.push(date)
  }

  return dates
}
