const timeline = [
  {
    "id": 1,
    "node_id": "A",
    "url": "https://api.github.com/repos/piyoppi/examples/issues/events/1",
    "event": "labeled",
    "created_at": "2021-08-25T13:05:00Z",
    "label": {
      "name": "label1",
      "color": "d876e3"
    },
  },
  {
    "id": 2,
    "node_id": "B",
    "url": "https://api.github.com/repos/piyoppi/examples/issues/events/2",
    "event": "unlabeled",
    "created_at": "2021-08-25T13:15:00Z",
    "label": {
      "name": "label1",
      "color": "d876e3"
    },
  },
  {
    "id": 3,
    "node_id": "C",
    "url": "https://api.github.com/repos/piyoppi/examples/issues/events/3",
    "event": "labeled",
    "created_at": "2021-08-25T13:30:00Z",
    "label": {
      "name": "label1",
      "color": "d876e3"
    },
  },
  {
    "id": 4,
    "node_id": "D",
    "url": "https://api.github.com/repos/piyoppi/examples/issues/events/4",
    "event": "unlabeled",
    "created_at": "2021-08-25T13:40:00Z",
    "label": {
      "name": "label1",
      "color": "d876e3"
    },
  },
  {
    "id": 5,
    "node_id": "E",
    "url": "https://api.github.com/repos/piyoppi/examples/issues/events/5",
    "event": "labeled",
    "created_at": "2021-08-25T13:15:00Z",
    "label": {
      "name": "label2",
      "color": "d876e3"
    },
  }
]

const closedTimelineItem = {
  "id": 100,
  "node_id": "AAA",
  "url": "https://api.github.com/repos/piyoppi/examples/issues/events/100",
  "event": "closed",
  "created_at": "2021-08-25T14:00:00Z"
}

const labeledTimes = require('../src/labeledTimes.js')

test('Should return times', () => {
  expect(labeledTimes.getDurations(timeline)).toEqual([
    {
      labelName: 'label1',
      durationMinute: 20
    }
  ])

  expect(labeledTimes.getDurations([...timeline, closedTimelineItem])).toEqual([
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


test('Should return issueBody', () => {
  expect(labeledTimes.getIssueBody([...timeline, closedTimelineItem])).toEqual(
`|label|duration(min)|
| --- | --- |
|label1|20|
|label2|45|
`
  )
})
