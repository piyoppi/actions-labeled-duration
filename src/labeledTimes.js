const getDurations = (timeline) => {
  const dayjs = require('dayjs')

  const labeledTimelineItems = timeline.filter(item => ['labeled', 'unlabeled'].includes(item.event))
  const closedTimelineItem = timeline.filter(item => ['closed'].includes(item.event))[0] || null

  const timelinesGroupByLabel = {} 
  labeledTimelineItems.forEach(timelineItem => {
    if (!timelinesGroupByLabel[timelineItem.label.name]) {
      timelinesGroupByLabel[timelineItem.label.name] = [timelineItem]
    } else {
      timelinesGroupByLabel[timelineItem.label.name].push(timelineItem)
    }
  })

  return Object.keys(timelinesGroupByLabel).map(labelName => {
    let durationMinute = 0

    const timeline = timelinesGroupByLabel[labelName]
    timeline.forEach((timelineItem, index) => {
      if (timelineItem.event === 'unlabeled') {
        durationMinute += dayjs(timelineItem.created_at).diff(timeline[index - 1].created_at, 'minute')
      }
    })

    const lastTimelineItem = timeline[timeline.length - 1]
    if (lastTimelineItem.event === 'labeled' && closedTimelineItem) {
      durationMinute += dayjs(closedTimelineItem.created_at).diff(lastTimelineItem.created_at, 'minute')
    }

    return {
      labelName,
      durationMinute
    }
  }).filter(obj => obj.durationMinute > 0)
}

const getIssueBody = (timeline) => {
  const durations = getDurations(timeline)
  const lines = []

  lines.push('|label|duration(min)|')
  lines.push('| --- | --- |')
  durations.forEach(duration => {
    lines.push(`|${duration.labelName}|${duration.durationMinute}|`)
  })

  return lines.reduce((acc, val) => acc + `${val}\n`, '')
}

module.exports = {
  getDurations,
  getIssueBody
}
