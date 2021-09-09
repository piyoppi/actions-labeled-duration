module.exports = async (octokit, owner, repo, issueNumber, limit) => {
  let fetchCount = 0
  const responses = []

  while(fetchCount++ < limit) {
    const timelineResponse = await octokit.request(`GET /repos/{owner}/{repo}/issues/{issueNumber}/timeline?page=${fetchCount}`, {
      owner,
      repo,
      issueNumber,
      mediaType: {
        previews: [
          'mockingbird',
          'starfox-preview'
        ]
      }
    })
    if (timelineResponse.length === 0) break

    responses.push(timelineResponse)
  }

  return responses.flat()
}
