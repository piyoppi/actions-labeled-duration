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
    if (!timelineResponse.data || timelineResponse.data.length === 0) break

    responses.push(timelineResponse.data)
  }

  return responses.flat()
}
