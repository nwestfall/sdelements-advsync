const fetch = require('node-fetch');

class SDElements {
    constructor(url, apitoken, project) {
        this.url = url;
        this.apitoken = apitoken;
        this.project = project;
    }

    async getTasks() {
        const response = await fetch(`${this.url}/api/v2/projects/${this.project}/tasks/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Token ${this.apitoken}`
            }
        });

        const body = await response.text();
        if(!response.ok) {
            throw new Error(`${response.statusText} - ${body}`)
        }

        return JSON.parse(body).results;
    }

    async getTask(taskId) {
        const response = await fetch(`${this.url}/api/v2/projects/${this.project}/tasks/${this.project}-${taskId}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Token ${this.apitoken}`
            }
        });

        const body = await response.text();
        if(!response.ok) {
            throw new Error(`${response.statusText} - ${body}`)
        }

        return JSON.parse(body);
    }

    async findTaskFromIssueTitle(title) {
        try {
            const idFromTitle = title.split(':')[0];
            const task = await this.getTask(idFromTitle);
            return task;
        } catch {}
        return null
    }

    async addNoteToTask(taskId, note) {
        const reqBody = {
            text: note
        };
        const response = await fetch(`${this.url}/api/v2/projects/${this.project}/tasks/${taskId}/notes/`, {
            method: 'POST',
            body: JSON.stringify(reqBody),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Token ${this.apitoken}`
            }
        });
        const body = await response.text();
        if(!response.ok) {
            throw new Error(`${response.statusText} - ${body}`)
        }
    }

    async assignUsersToTask(taskId, emails) {
        const reqBody = {
            assigned_to: emails
        };
        const response = await fetch(`${this.url}/api/v2/projects/${this.project}/tasks/${taskId}/`, {
            method: 'PATCH',
            body: JSON.stringify(reqBody),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Token ${this.apitoken}`
            }
        });
        const body = await response.text();
        if(!response.ok) {
            throw new Error(`${response.statusText} - ${body}`)
        }
    }

    async assignTagsToTask(taskId, tags) {
        const reqBody = {
            tags: tags
        }
        const response = await fetch(`${this.url}/api/v2/projects/${this.project}/tasks/${taskId}/`, {
            method: 'PATCH',
            body: JSON.stringify(reqBody),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Token ${this.apitoken}`
            }
        });
        const body = await response.text();
        if(!response.ok) {
            throw new Error(`${response.statusText} - ${body}`)
        }
    }

    async createAVerificationNote(taskId, email, status, reference, desc) {
        let reqBody = {
            analysis_session: null,
            behaviour: "combine",
            confidence: "high",
            findings: {},
            findings_ref: `${email}-${reference}`,
            status: status
        };
        if(desc) {
            reqBody.findings = [{
                desc: desc,
                count: 1
            }]
        }
        let response = await fetch(`${this.url}/api/v2/projects/${this.project}/tasks/${taskId}/analysis-notes/`, {
            method: 'POST',
            body: JSON.stringify(reqBody),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Token ${this.apitoken}`
            }
        });
        let body = await response.text();
        if(!response.ok) {
            throw new Error(`${response.statusText} - ${body}`)
        }
    }
}

module.exports = SDElements