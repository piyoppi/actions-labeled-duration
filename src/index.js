const github = require('@actions/github');
const core = require('@actions/core');
const labeledTimes = require('../src/labeledTimes.js')

async function run() {
  const token = core.getInput('access-token');

  const octokit = github.getOctokit(token)

  const timelineResponse = await octokit.rest.issues.listEventsForTimeline({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: github.context.issue.number
  });
  const timeline = timelineResponse.data

  console.log(timeline)

  const body = labeledTimes.getIssueBody(timeline)

  await octokit.rest.issues.createComment({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: github.context.issue.number,
    body
  });
}

run();
