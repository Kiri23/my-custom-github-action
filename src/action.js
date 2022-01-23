require('dotenv').config();
const fetch = require('node-fetch');
const core = require('@actions/core');
const github = require('@actions/github');
const {PivotalTracker} = require('../library/')

const getBranchName = (eventName, payload) => {
  let branchName;
  switch (eventName) {
      case 'push':
          branchName = payload.ref.replace('refs/heads/', '');
          break;
      case 'pull_request':
          branchName = payload.pull_request.head.ref;
          break;
      default:
          throw new Error(`Invalid event name when retrieving branch name: ${eventName}`);
  }
  return branchName;
}


async function run() {
  const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN');
  const PIVOTAL_TOKEN = core.getInput('PIVOTAL_TOKEN') || process.env.PIVOTAL_TOKEN;
  const PROJECT_ID = core.getInput('PROJECT_ID') || process.env.PROJECT_ID;

  const eventName = github.context.eventName;
  const branchName = getBranchName(eventName, github.context.payload);
  // const branchName = '180748928-pivotal'
  const lookForTicketNumberRegex = /[^a-z-.#]\ *([0-9]){7}\d/g;
  let storyId = branchName.match(lookForTicketNumberRegex);
  if (storyId) storyId = storyId.toString().trim()
  console.log(storyId)
  // const storyId = '180952984' // regex expresion to filter number
  // const storyId = '180864555' // no blockers

  const Pivotal = new PivotalTracker(PIVOTAL_TOKEN,PROJECT_ID);
  const storyHasBlockers = await Pivotal.storyHasBlockers(storyId);
  if (storyHasBlockers) {
    core.setFailed(`Are you sure you want to merge this Pull request? This PR has a blocker in pivotal for the story ${storyId}`)
  } 
}

run().catch(e => {
  core.setFailed(e.message)
});



/**
 *   const { context = {} } = github;
  const { pull_request } = context.payload;

 * if ( !pull_request ) {
    throw new Error('Could not find pull request!')
  };

  console.log(`Found pull request: ${pull_request.number}`);

  const octokit = github.getOctokit(GITHUB_TOKEN)

  await octokit.issues.createComment({
    ...context.repo,
    issue_number: pull_request.number,
    body: `${message}\n\n<img src="${gifUrl}" alt="${searchTerm}" />`
  });
 */
