const fetch = require('node-fetch')

class PivotalTracker {
    constructor(token, projectId){
        this.baseUrl = 'https://www.pivotaltracker.com/services/v5/'
        this.token = token;
        this.projectId = projectId;
    }
    async getBlockersOfStory(storyId){
        // call the fetch endpoint
        console.log('Calling the fetch endpoint', this.projectId, this.token);
        const endpoint = `${this.baseUrl}projects/${this.projectId}/stories/${storyId}/blockers`
        const response = await fetch(endpoint, {method:'GET', headers:{'X-TrackerToken': this.token}});
        return await response.json();
    }
    async storyHasBlockers(storyId){
        const blockers = await this.getBlockersOfStory(storyId)
        if (blockers && blockers.kind === "error"){
            const errorMessage = blockers.generalProblem || blockers.error || blockers.code
            const possibleFix = blockers.possible_fix && blockers.possible_fix;
            throw new Error(`${errorMessage} Possible fix: ${possibleFix}`)
        }
        return blockers.data.every(blocker => blocker.resolved)
    }
}

module.exports = PivotalTracker;