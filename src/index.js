const github = require('@actions/github');
const core = require('@actions/core');
const labeledTimes = require('../src/labeledTimes.js')

async function run() {
  const token = core.getInput('access-token')
  const octokit = github.getOctokit(token)

  const labelsParam = core.getInput('labels')
  const projectColumnsParam = core.getInput('project_columns')
  const additionalIssueComment = core.getInput('issue_comment') || ''
  const labels = labelsParam ? labelsParam.split(',') : []
  const projectColumns = projectColumnsParam ? projectColumnsParam.split(',') : []

  const issueDetailsResponse = await octokit.request('GET /repos/{owner}/{repo}/issues/{issue_number}', {
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: github.context.issue.number
  })
  const issueDetails = issueDetailsResponse.data

  if (!issueDetails.closed_at) {
    core.setFailed('The issue is still not closed')
    return
  }

  const timelineResponse = await octokit.request('GET /repos/{owner}/{repo}/issues/{issue_number}/timeline', {
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: github.context.issue.number,
    mediaType: {
      previews: [
        'mockingbird',
        'starfox-preview'
      ]
    }
  })
  const timeline = timelineResponse.data

  const labeledDurations = labeledTimes.getLabeledDurations(timeline, labels)
  const projectStateDurations = labeledTimes.getProjectStateDuration(timeline, projectColumns)

  const body = `
${additionalIssueComment}\n
${labeledTimes.getLabeledIssueBody(labeledDurations)}\n
${labeledTimes.getProjectStateIssueBody(projectStateDurations)}\n
`

  await octokit.rest.issues.createComment({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: github.context.issue.number,
    body
  });

  core.setOutput("labeled_duration_details", JSON.stringify({
    issue: {
      number: github.context.issue.number,
      title: issueDetails.title,
      labels: issueDetails.labels.map(label => label.name),
      createdAt: issueDetails.created_at,
      closedAt: issueDetails.closed_at,
    },
    labeledDurations,
    projectStateDurations
  }));
}

run();
