const getTicketNumberFromBranchName = (branchName) => {
    const lookForTicketNumberRegex = /[^a-z-.#]\ *([0-9]){7}\d/g;
    let storyId = branchName.match(lookForTicketNumberRegex);
    if (storyId) return storyId.toString().trim()
}
const getBranchName = (eventName, payload) => {
    switch (eventName) {
        case 'push':
            return payload.ref.replace('refs/heads/', '');
        case 'pull_request':
            return payload.pull_request.head.ref;
        default:
            throw new Error(`Invalid event name when retrieving branch name: ${eventName}`);
    }
}

module.exports = {
    getBranchName,
    getTicketNumberFromBranchName
}