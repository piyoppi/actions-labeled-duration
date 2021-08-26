const github = require('@actions/github');
const core = require('@actions/core');
const labeledTimes = require('../src/labeledTimes.js')

async function run() {
  const token = core.getInput('access-token')
  const octokit = github.getOctokit(token)

  const labelsParam = core.getInput('labels')
  const projectColumnsParam = core.getInput('project_columns')
  const labels = labelsParam ? labelsParam.split(',') : []
  const projectColumns = projectColumnsParam ? projectColumnsParam.split(',') : []

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

  const body = `
${labeledTimes.getLabeledIssueBody(timeline, labels)}\n
${labeledTimes.getProjectStateIssueBody(timeline, projectColumns)}\n
`

  await octokit.rest.issues.createComment({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: github.context.issue.number,
    body
  });
}

run();
