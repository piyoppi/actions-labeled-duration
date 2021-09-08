const dayjs = require('dayjs')
const duration = require('dayjs/plugin/duration')
dayjs.extend(duration)

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
  const closedTimelineItem = timeline.filter(item => ['closed'].includes(item.event)).reverse()[0] || null
  const timelinesGroupByLabel =  timelineGroupByAttribute(labeledTimelineItems, (timeline) => timeline.label.name)

  return Object.keys(timelinesGroupByLabel).map(labelName => {
    const timeline = timelinesGroupByLabel[labelName]

    let durationMinute = getDuration(timeline, 'unlabeled')

    const lastTimelineItem = timeline[timeline.length - 1]
    if (lastTimelineItem.event === 'labeled' && closedTimelineItem) {
      durationMinute += dayjs(closedTimelineItem.created_at).diff(lastTimelineItem.created_at, 'minute')
    }

    const duration = dayjs.duration(durationMinute, 'minutes')

    return {
      name: labelName,
      durationMinute,
      durationDisplayed: `${Math.floor(duration.asHours())} h ${duration.minutes()} min (${duration.days()} day)`
    }
  }).filter(obj => obj.durationMinute > 0)
}

const getProjectStateDuration = (timeline, columns) => {
  const projectTimelineItems = timeline.filter(item => ['converted_note_to_issue', 'added_to_project', 'moved_columns_in_project'].includes(item.event))
  const durations = {}

  projectTimelineItems.forEach((timelineItem, index) => {
    if (index > projectTimelineItems.length - 2) return

    const columnName = timelineItem.project_card.column_name
    if (!columns.includes(columnName)) return

    if (durations[columnName] === undefined) durations[columnName] = 0

    durations[columnName] += dayjs(projectTimelineItems[index + 1].created_at).diff(timelineItem.created_at, 'minute')
  })


  return Object.keys(durations).map(columnName => {
    const duration = dayjs.duration(durations[columnName], 'minutes')

    return {
      name: columnName,
      durationMinute: durations[columnName],
      durationDisplayed: `${Math.floor(duration.asHours())} h ${duration.minutes()} min (${duration.days()} day)`
    }
  })
}

const getMarkdownTable = (columnNames, columns) => {
  const lines = []

  lines.push(columnNames.reduce((acc, val) => `${acc}|${val}`, '') + '|')
  lines.push(columnNames.reduce((acc) => `${acc}| --- `, '') + '|')
  columns.forEach(column => {
    lines.push(column.reduce((acc, val) => `${acc}|${val}`, '') + '|')
  })

  return lines.reduce((acc, val) => acc + `${val}\n`, '')
}

const getLabeledIssueBody = (durations) => {
  if (durations.length === 0) return ''

  const columnNames = ['label', 'duration(min)', 'duration (hours / minutes / days)']
  const columns = durations.map(duration => [duration.name, duration.durationMinute, duration.durationDisplayed])

  return getMarkdownTable(columnNames, columns)
}

const getProjectStateIssueBody = (durations) => {
  if (durations.length === 0) return ''

  const columnNames = ['project column', 'duration(min)', 'duration (hours / minutes / days)']
  const columns = durations.map(duration => [duration.name, duration.durationMinute, duration.durationDisplayed])

  return getMarkdownTable(columnNames, columns)
}

module.exports = {
  getLabeledDurations,
  getProjectStateDuration,
  getLabeledIssueBody,
  getProjectStateIssueBody
}
