const timeline = [
  {
    "id": 1,
    "event": "labeled",
    "created_at": "2021-08-25T13:05:00Z",
    "label": {
      "name": "label1"
    },
  },
  {
    "id": 2,
    "event": "unlabeled",
    "created_at": "2021-08-25T13:15:00Z",
    "label": {
      "name": "label1"
    },
  },
  {
    "id": 3,
    "event": "labeled",
    "created_at": "2021-08-25T13:30:00Z",
    "label": {
      "name": "label1"
    },
  },
  {
    "id": 4,
    "event": "unlabeled",
    "created_at": "2021-08-25T13:40:00Z",
    "label": {
      "name": "label1"
    },
  },
  {
    "id": 5,
    "event": "labeled",
    "created_at": "2021-08-25T13:15:00Z",
    "label": {
      "name": "label2"
    },
  },
  {
    "id": 6,
    "event": "labeled",
    "created_at": "2021-08-25T13:20:00Z",
    "label": {
      "name": "label3"
    },
  },
  {
    "id": 7,
    "url": "https://api.github.com/repos/piyoppi/examples/issues/events/7",
    "event": "labeled",
    "created_at": "2021-08-25T13:25:00Z",
    "label": {
      "name": "label3"
    },
  }
]

const projectTimeline = [
  {
    "id": 1,
    "event": "added_to_project",
    "created_at": "2021-08-25T13:00:00Z",
    "project_card": {
      "column_name": "TODO"
    },
  },
  {
    "id": 2,
    "event": "labeled",
    "created_at": "2021-08-25T13:01:00Z",
    "label": {
      "name": "label1"
    },
  },
  {
    "id": 3,
    "event": "moved_columns_in_project",
    "created_at": "2021-08-25T13:05:00Z",
    "project_card": {
      "column_name": "Doing"
    },
  },
  {
    "id": 4,
    "event": "moved_columns_in_project",
    "created_at": "2021-08-25T13:10:00Z",
    "project_card": {
      "column_name": "Done"
    },
  },
  {
    "id": 5,
    "event": "moved_columns_in_project",
    "created_at": "2021-08-25T13:15:00Z",
    "project_card": {
      "column_name": "Doing"
    },
  },
  {
    "id": 6,
    "event": "labeled",
    "created_at": "2021-08-25T13:16:00Z",
    "label": {
      "name": "label1"
    },
  },
  {
    "id": 7,
    "event": "moved_columns_in_project",
    "created_at": "2021-08-25T13:20:00Z",
    "project_card": {
      "column_name": "Done"
    },
  }
]

const convertProjectCardToIssueTimeline = [
  {
    "id": 1,
    "event": "converted_note_to_issue",
    "created_at": "2021-08-25T13:00:00Z",
    "project_card": {
      "column_name": "TODO"
    },
  },
  {
    "id": 2,
    "event": "labeled",
    "created_at": "2021-08-25T13:01:00Z",
    "label": {
      "name": "label1"
    },
  },
  {
    "id": 3,
    "event": "moved_columns_in_project",
    "created_at": "2021-08-25T13:05:00Z",
    "project_card": {
      "column_name": "Doing"
    },
  },
  {
    "id": 4,
    "event": "moved_columns_in_project",
    "created_at": "2021-08-25T13:10:00Z",
    "project_card": {
      "column_name": "Done"
    },
  },
  {
    "id": 5,
    "event": "moved_columns_in_project",
    "created_at": "2021-08-25T13:15:00Z",
    "project_card": {
      "column_name": "Doing"
    },
  },
  {
    "id": 6,
    "event": "labeled",
    "created_at": "2021-08-25T13:16:00Z",
    "label": {
      "name": "label1"
    },
  },
  {
    "id": 7,
    "event": "moved_columns_in_project",
    "created_at": "2021-08-25T13:20:00Z",
    "project_card": {
      "column_name": "Done"
    },
  }
]

const closedTimelineItem = {
  "id": 100,
  "url": "https://api.github.com/repos/piyoppi/examples/issues/events/100",
  "event": "closed",
  "created_at": "2021-08-25T14:00:00Z"
}

const closedTimelineItem2 = {
  "id": 101,
  "url": "https://api.github.com/repos/piyoppi/examples/issues/events/101",
  "event": "closed",
  "created_at": "2021-08-25T14:30:00Z"
}

const labeledTimes = require('../src/labeledTimes.js')

describe('getLabeledDurations', () => {
  test('Should return labeled times', () => {
    expect(labeledTimes.getLabeledDurations(timeline, ['label1', 'label2'])).toEqual([
      {
        name: 'label1',
        durationMinute: 20,
        durationDisplayed: '0 h 20 min (0 day)'
      }
    ])

    expect(labeledTimes.getLabeledDurations([...timeline, closedTimelineItem], ['label1', 'label2'])).toEqual([
      {
        name: 'label1',
        durationMinute: 20,
        durationDisplayed: '0 h 20 min (0 day)'
      },
      {
        name: 'label2',
        durationMinute: 45,
        durationDisplayed: '0 h 45 min (0 day)'
      }
    ])

    expect(labeledTimes.getLabeledDurations([...timeline, closedTimelineItem, closedTimelineItem2], ['label1', 'label2'])).toEqual([
      {
        name: 'label1',
        durationMinute: 20,
        durationDisplayed: '0 h 20 min (0 day)'
      },
      {
        name: 'label2',
        durationMinute:75,
        durationDisplayed: '1 h 15 min (0 day)'
      }
    ])
  })
})

describe('getProjectStateDuration', () => {
  test('Should return project state duration', () => {
    expect(labeledTimes.getProjectStateDuration(projectTimeline, ['TODO', 'Doing'])).toEqual([
      {
        name: 'TODO',
        durationMinute: 5,
        durationDisplayed: '0 h 5 min (0 day)'
      },
      {
        name: 'Doing',
        durationMinute: 10,
        durationDisplayed: '0 h 10 min (0 day)'
      }
    ])

    expect(labeledTimes.getProjectStateDuration(convertProjectCardToIssueTimeline, ['TODO', 'Doing'])).toEqual([
      {
        name: 'TODO',
        durationMinute: 5,
        durationDisplayed: '0 h 5 min (0 day)'
      },
      {
        name: 'Doing',
        durationMinute: 10,
        durationDisplayed: '0 h 10 min (0 day)'
      }
    ])

    expect(labeledTimes.getProjectStateDuration(projectTimeline.slice(0, 4), ['TODO', 'Doing'])).toEqual([
      {
        name: 'TODO',
        durationMinute: 5,
        durationDisplayed: '0 h 5 min (0 day)'
      },
      {
        name: 'Doing',
        durationMinute: 5,
        durationDisplayed: '0 h 5 min (0 day)'
      }
    ])
  })
})

describe('getLabeledIssueBody', () => {
  test('Should return issueBody', () => {
    const durations = labeledTimes.getLabeledDurations([...timeline, closedTimelineItem], ['label1', 'label2'])
    expect(labeledTimes.getLabeledIssueBody(durations)).toEqual(
  `|label|duration(min)|duration (hours / minutes / days)|
| --- | --- | --- |
|label1|20|0 h 20 min (0 day)|
|label2|45|0 h 45 min (0 day)|
`
    )

    expect(labeledTimes.getLabeledIssueBody([])).toEqual('')
  })
})

describe('getProjectStateIssueBody', () => {
  test('Should return issueBody', () => {
    const durations = labeledTimes.getProjectStateDuration(projectTimeline, ['TODO', 'Doing'])
    expect(labeledTimes.getProjectStateIssueBody(durations)).toEqual(
  `|project column|duration(min)|duration (hours / minutes / days)|
| --- | --- | --- |
|TODO|5|0 h 5 min (0 day)|
|Doing|10|0 h 10 min (0 day)|
`
    )

    expect(labeledTimes.getProjectStateIssueBody([])).toEqual('')
  })
})
