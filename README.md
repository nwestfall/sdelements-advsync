# Advanced GitHub Sync for SD Elements
This action lets you sync more data between GitHub and SD Elements.  It will send comments, tags and manual verifications to SD Elements after they are created in GitHub.

**This still requires the GitHub integration with SD Elements to be enabled.  This works on top of the issues that get created by SD Elements.**

## Creating a Workflow
Here is a simple workflow that uses all the features.  You can control more/less integration (for example, maybe you don't want to sync tags) by just changing the workflow triggers.
```yml
name: SD Elements Sync

on:
  issues:
    types:
      - labeled
      - unlabeled
      - closed
      - assigned
      - unassigned
  issue_comment:
    types:
      - created

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: SD Elements Sync
        uses: nwestfall/sdelements-advsync@main
        with:
          url: ${{ secrets.SD_ELEMENTS_URL }}
          apitoken: ${{ secrets.SD_ELEMENTS_API_TOKEN }}
          project: ${{ secrets.SD_ELEMENTS_PROJECT }}
          gh_token: ${{ secrets.GH_TOKEN }}
```

## Inputs
 - `url`:  The base URL of your SD Elements site.  For example, `https://mysite.sdelements.com`
 - `apitoken`: An API token that you generated.  This action only supports [Token Authentication](https://docs.sdelements.com/release/5.16/api/docs/authentication/#token-authentication).
  - `project`: The project ID that you are syncing issues with.  This ID can be found on your dashboard for the project.
 - `gh_token`: A GitHub token that has the ability to read users and their profiles.  This is used to grab the email address of the user.  We assume that the user in both systems shares the same email address so that they can be referenced.  **Future improvements for this are planned**

## Supported Actions
 - Closing an issue adds a comment to the task, stating who closed it
  - Assigning or unassigning users will create the same assignments in SD Elements
  - Adding or removing labels will create or remove tags in SD Elements
  - Adding a comment to the issue will add the same comment in SD Elements
  - Commands can be entered as a comment to perform other actions (see "Commands" section)

## Commands
In a comment for an issue, you can enter some commands to send additional data to SD Elements.

 - `/sdpass`: This will add a manual verification (pass) to the task in SD Elements.  The user will be associated to the verification.
 - `/sdfail COMMENT`: This will add a manual verification (fail) to the task in SD Elements.  The user will be associated to the verification along with the `COMMENT` to follow the command as reference.