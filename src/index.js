const github = require('@actions/github');
const core = require('@actions/core');
const labeledTimes = require('../src/labeledTimes.js')

async function run() {
  const token = core.getInput('access-token');

  const octokit = github.getOctokit(token)

  const timeline = await octokit.rest.issues.listEventsForTimeline({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: github.context.issue.number
  });

  const body = labeledTimes.getIssueBody(timeline)

  octokit.rest.issues.createComment({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: github.context.issue.number,
    body
  });
}

run();
