const github = require('@actions/github');
const core = require('@actions/core');

async function run() {
  const token = core.getInput('myToken');

  const octokit = github.getOctokit(token)

  const timeline = await octokit.rest.issues.listEventsForTimeline({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: github.context.issue.number
  });

  console.log(timeline);
}

run();
