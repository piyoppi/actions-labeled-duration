const getTimeline = require('../src/getTimeline.js')

test('Should call request method', async () => {
  const mockedOctokit = {
    request: jest.fn().mockReturnValueOnce(Promise.resolve({data: [1, 2, 3]}))
      .mockReturnValueOnce(Promise.resolve({data: [4, 5]}))
      .mockReturnValue(Promise.resolve([{data: []}]))
  }

  const expectedOctokitRequestParams = {
    owner: 'owner',
    repo: 'repo',
    issueNumber: 1,
    mediaType: expect.anything()
  }

  const response = await getTimeline(mockedOctokit, 'owner', 'repo', 1, 10)
  expect(response).toEqual([1, 2, 3, 4, 5])
  expect(mockedOctokit.request).nthCalledWith(1, 'GET /repos/{owner}/{repo}/issues/{issueNumber}/timeline?page=1', expectedOctokitRequestParams)
  expect(mockedOctokit.request).nthCalledWith(2, 'GET /repos/{owner}/{repo}/issues/{issueNumber}/timeline?page=2', expectedOctokitRequestParams)
  expect(mockedOctokit.request).nthCalledWith(3, 'GET /repos/{owner}/{repo}/issues/{issueNumber}/timeline?page=3', expectedOctokitRequestParams)
})

test('The number of requests should be limited', async () => {
  const mockedOctokit = {
    request: jest.fn().mockReturnValue(Promise.resolve({data: [1]}))
  }

  const response = await getTimeline(mockedOctokit, 'owner', 'repo', 1, 5)

  expect(response).toEqual([1, 1, 1, 1, 1])
  expect(mockedOctokit.request).toBeCalledTimes(5)
})
