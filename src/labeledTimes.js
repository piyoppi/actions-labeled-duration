const dayjs = require('dayjs')

const timelineGroupByAttribute = (timeline, attrCallback) => {
  const timelinesGroup = {}

  timeline.forEach(timelineItem => {
    const key = attrCallback(timelineItem)
    if (!timelinesGroup[key]) {
      timelinesGroup[key] = [timelineItem]
    } else {
      timelinesGroup[key].push(timelineItem)
    }
  })

  return timelinesGroup
}

const getDuration = (timeline, endKey) => {
  let durationMinute = 0

  timeline.forEach((timelineItem, index) => {
    if (timelineItem.event === endKey) {
      durationMinute += dayjs(timelineItem.created_at).diff(timeline[index - 1].created_at, 'minute')
    }
  })

  return durationMinute
}

const getLabeledDurations = (timeline, labels) => {
  const labeledTimelineItems = timeline.filter(item => ['labeled', 'unlabeled'].includes(item.event) && labels.includes(item.label.name))
  const closedTimelineItem = timeline.filter(item => ['closed'].includes(item.event))[0] || null
  const timelinesGroupByLabel =  timelineGroupByAttribute(labeledTimelineItems, (timeline) => timeline.label.name)

  return Object.keys(timelinesGroupByLabel).map(labelName => {
    const timeline = timelinesGroupByLabel[labelName]

    let durationMinute = getDuration(timeline, 'unlabeled')

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

const getProjectStateDuration = (timeline, columns) => {
  const projectTimelineItems = timeline.filter(item => ['added_to_project', 'moved_columns_in_project'].includes(item.event) && columns.includes(item.project_card.column_name))
  const durations = {}

  projectTimelineItems.forEach((timelineItem, index) => {
    if (index > projectTimelineItems.length - 2) return
    const columnName = timelineItem.project_card.column_name

    if (durations[columnName] === undefined) durations[columnName] = 0

    durations[columnName] += dayjs(projectTimelineItems[index + 1].created_at).diff(timelineItem.created_at, 'minute')
  })

  return Object.keys(durations).map(columnName => {
    return {
      columnName,
      durationMinute: durations[columnName]
    }
  })
}

const getLabeledIssueBody = (timeline, labels) => {
  const durations = getLabeledDurations(timeline, labels)
  if (durations.length === 0) return ''

  const lines = []

  lines.push('|label|duration(min)|')
  lines.push('| --- | --- |')
  durations.forEach(duration => {
    lines.push(`|${duration.labelName}|${duration.durationMinute}|`)
  })

  return lines.reduce((acc, val) => acc + `${val}\n`, '')
}

const getProjectStateIssueBody = (timeline, columns) => {
  const durations = getProjectStateDuration(timeline, columns)
  if (durations.length === 0) return ''

  const lines = []

  lines.push('|project column|duration(min)|')
  lines.push('| --- | --- |')
  durations.forEach(duration => {
    lines.push(`|${duration.columnName}|${duration.durationMinute}|`)
  })

  return lines.reduce((acc, val) => acc + `${val}\n`, '')
}

module.exports = {
  getLabeledDurations,
  getProjectStateDuration,
  getLabeledIssueBody,
  getProjectStateIssueBody
}
