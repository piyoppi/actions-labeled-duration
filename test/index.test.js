const github = require('@actions/github');
const core = require('@actions/core');
const timelineResponse = require('./responses/timeline.json')
const issueResponse = require('./responses/issue.json')

jest.mock('@actions/github')
jest.mock('@actions/core')

const run = require('../src/script.js')

const mockedOctokit = {
  request: jest.fn().mockImplementation((url, option) => {
    switch(url) {
      case 'GET /repos/{owner}/{repo}/issues/{issueNumber}': return {data: issueResponse}
      case 'GET /repos/{owner}/{repo}/issues/{issueNumber}/timeline?page=1': return {data: timelineResponse}
      case 'GET /repos/{owner}/{repo}/issues/{issueNumber}/timeline?page=2': return {data: []}
    }
  }),
  rest: {
    issues: {
      createComment: jest.fn()
    }
  }
}

github.getOctokit = jest.fn().mockReturnValue(mockedOctokit)

core.getInput = jest.fn().mockImplementation(key => {
  switch(key) {
    case 'access_token': return 'dummy-access-token'
    case 'repository_owner': return 'owner'
    case 'repository_name': return 'repo'
    case 'issue_number': return 123
    case 'labels': return 'label1,label2'
    case 'project_columns': return 'Todo,Doing'
    case 'issue_comment': return 'Comment'
    default: ''
  }
})

test('Should work properly', async () => {
  let actualOutputs = ''
  core.setOutput = jest.fn().mockImplementation((key, value) => {
    switch(key) {
      case 'labeled_duration_details': 
        actualOutputs = value
        return
    }
  })

  await run()

  expect(mockedOctokit.rest.issues.createComment).toHaveBeenCalledWith({
    owner: 'owner',
    repo: 'repo',
    issue_number: 123,
    body: `
Comment

|label|duration(min)|duration (hours / minutes / days)|
| --- | --- | --- |
|label1|0|0 h 0 min (0 day)|
|label2|0|0 h 0 min (0 day)|

|project column|duration(min)|duration (hours / minutes / days)|
| --- | --- | --- |
|Todo|4|0 h 4 min (0 day)|
|Doing|7|0 h 7 min (0 day)|

`
  })

  expect(core.setOutput).toHaveBeenCalledWith('labeled_duration_details', expect.anything())
  expect(JSON.parse(actualOutputs)).toEqual(
    {
      issue: {
        number: 123,
        title: 'Test Title',
        labels: [],
        createdAt: expect.anything(),
        closedAt: expect.anything()
      },
      labeledDurations: {
        label1: {
          name: "label1",
          durationMinute: 0,
          durationDisplayed: "0 h 0 min (0 day)"
        },
        label2: {
          name: "label2",
          durationMinute: 0,
          durationDisplayed: "0 h 0 min (0 day)"
        }
      },
      projectStateDurations: {
        "Todo": {
          name: 'Todo',
          durationMinute: 4,
          durationDisplayed: '0 h 4 min (0 day)'
        },
        "Doing": {
          name: 'Doing',
          durationMinute: 7,
          durationDisplayed: '0 h 7 min (0 day)'
        }
      }
    }
  )
})
