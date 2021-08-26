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

const closedTimelineItem = {
  "id": 100,
  "url": "https://api.github.com/repos/piyoppi/examples/issues/events/100",
  "event": "closed",
  "created_at": "2021-08-25T14:00:00Z"
}

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

const labeledTimes = require('../src/labeledTimes.js')

describe('getLabeledDurations', () => {
  test('Should return labeled times', () => {
    expect(labeledTimes.getLabeledDurations(timeline, ['label1', 'label2'])).toEqual([
      {
        labelName: 'label1',
        durationMinute: 20
      }
    ])

    expect(labeledTimes.getLabeledDurations([...timeline, closedTimelineItem], ['label1', 'label2'])).toEqual([
      {
        labelName: 'label1',
        durationMinute: 20
      },
      {
        labelName: 'label2',
        durationMinute: 45
      }
    ])
  })
})

describe('getProjectStateDuration', () => {
  test('Should return project state duration', () => {
    expect(labeledTimes.getProjectStateDuration(projectTimeline, ['TODO', 'Doing'])).toEqual([
      {
        columnName: 'TODO',
        durationMinute: 5
      },
      {
        columnName: 'Doing',
        durationMinute: 10
      }
    ])
  })
})

describe('getLabeledIssueBody', () => {
  test('Should return issueBody', () => {
    expect(labeledTimes.getLabeledIssueBody([...timeline, closedTimelineItem], ['label1', 'label2'])).toEqual(
  `|label|duration(min)|
| --- | --- |
|label1|20|
|label2|45|
`
    )

    expect(labeledTimes.getLabeledIssueBody(timeline, [])).toEqual('')
  })
})

describe('getLabeledIssueBody', () => {
  test('Should return issueBody', () => {
    expect(labeledTimes.getProjectStateIssueBody(projectTimeline, ['TODO', 'Doing'])).toEqual(
  `|project column|duration(min)|
| --- | --- |
|TODO|5|
|Doing|10|
`
    )

    expect(labeledTimes.getProjectStateIssueBody(projectTimeline, [])).toEqual('')
  })
})
