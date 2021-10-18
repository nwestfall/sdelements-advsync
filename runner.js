#!/usr/bin/env node
const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const SDElements = require('./sdelements');

const cmdOptions = [
    { name: 'url', alias: 'u', type: String },
    { name: 'apitoken', alias: 't', type: String },
    { name: 'project', alias: 'p', type: String },
    { name: 'title', type: String },
    { name: 'help', alias: 'h', type: Boolean }
]

const sections = [
    {
        header: 'SD Elements Runner',
        content: 'Run actions against your project in SD Elements'
    },
    {
        header: 'Options',
        optionList: [
            {
                name: 'url',
                typeLabel: '{underline url}',
                description: 'The base URL for your SD Elements account'
            },
            {
                name: 'apitoken',
                typeLabel: '{underline apitoken}',
                description: 'The api token from your SD Elements Account'
            },
            {
                name: 'project',
                typeLabel: '{underline project}',
                description: 'The project ID you want to use'
            },
            {
                name: 'title',
                typeLabel: '{underline title}',
                description: 'The title of a task'
            },
            {
                name: 'help',
                description: 'Print this usage guide'
            }
        ]
    }
]


async function run() {
    try {
        const options = commandLineArgs(cmdOptions)

        if(options.help) {
            const usage = commandLineUsage(sections)
            console.log(usage)
        } else {
            if(!(options.url)) {
                console.error("--url is a required argument");
                return;
            }
            if(!(options.apitoken)) {
                console.error("--apitoken is a required argument");
                return;
            }
            if(!(options.project)) {
                console.error("--project is a required argument");
                return;
            }

            const sdelements = new SDElements(options.url, options.apitoken, options.project);
            
            if(options.title) {
                console.log("Getting task from title");
                const task = await sdelements.findTaskFromIssueTitle(options.title);
                console.log(task);
            } else {
                console.log("Getting tasks");
                const tasks = await sdelements.getTasks();
                console.log(`Found ${tasks.length} tasks`);
                console.log("Getting random task");
                const singleTask = await sdelements.getTask(tasks[0].task_id);
                console.log(singleTask);
            }
        }
    } catch(e) {
        console.error(e);
    }
}


run();