const github = require('@actions/github');
const core = require('@actions/core');
const labeledTimes = require('./labeledTimes.js')
const getTimeline = require('./getTimeline.js')

async function run() {
  const token = core.getInput('access-token')
  const octokit = github.getOctokit(token)

  const owner = core.getInput('repository_owner') || github.context.repo.owner
  const repo = core.getInput('repository_name') || github.context.repo.repo
  const issueNumber = core.getInput('issue_number') || github.context.issue.number

  const labelsParam = core.getInput('labels')
  const projectColumnsParam = core.getInput('project_columns')
  const additionalIssueComment = core.getInput('issue_comment') || ''
  const labels = labelsParam ? labelsParam.split(',') : []
  const projectColumns = projectColumnsParam ? projectColumnsParam.split(',') : []

  const issueDetailsResponse = await octokit.request('GET /repos/{owner}/{repo}/issues/{issueNumber}', {
    owner,
    repo,
    issueNumber
  })
  const issueDetails = issueDetailsResponse.data

  if (!issueDetails.closed_at) {
    core.setFailed('The issue is still not closed')
    return
  }

  const timeline = await getTimeline(octokit, owner, repo, issueNumber, 10)

  const labeledDurations = labeledTimes.getLabeledDurations(timeline, labels)
  const projectStateDurations = labeledTimes.getProjectStateDuration(timeline, projectColumns)

  const body = `
${additionalIssueComment}\n
${labeledTimes.getLabeledIssueBody(labeledDurations)}\n
${labeledTimes.getProjectStateIssueBody(projectStateDurations)}\n
`

  await octokit.rest.issues.createComment({
    owner,
    repo,
    issue_number: issueNumber,
    body
  });

  const convertDurationFunc = (acc, val) => {
    acc[val.name] = val
    return acc
  }

  core.setOutput("labeled_duration_details", JSON.stringify({
    issue: {
      number: github.context.issue.number,
      title: issueDetails.title,
      labels: issueDetails.labels.map(label => label.name),
      createdAt: issueDetails.created_at,
      closedAt: issueDetails.closed_at,
    },
    labeledDurations: labeledDurations.reduce(convertDurationFunc, {}),
    projectStateDurations: projectStateDurations.reduce(convertDurationFunc, {})
  }));
}

run();
