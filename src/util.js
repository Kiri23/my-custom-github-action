const getTicketNumberFromBranchName = (branchName) => {
    const lookForTicketNumberRegex = /[^a-z-.#]\ *([0-9]){7}\d/g;
    let storyId = branchName.match(lookForTicketNumberRegex);
    if (storyId) storyId = storyId.toString().trim()
}
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
}

module.exports = {
    getBranchName,
    getTicketNumberFromBranchName
}