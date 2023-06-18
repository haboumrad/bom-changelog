![GitHub](https://img.shields.io/github/license/haboumrad/bom-changelog)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fhaboumrad%2Fbom-changelog.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fhaboumrad%2Fbom-changelog?ref=badge_shield)

![build and test](https://github.com/haboumrad/bom-changelog/actions/workflows/node.js.yml/badge.svg)
[![codecov](https://codecov.io/gh/haboumrad/bom-changelog/branch/main/graph/badge.svg?token=XB6USKQJPY)](https://codecov.io/gh/haboumrad/bom-changelog)
[![semgrep](https://github.com/haboumrad/bom-changelog/actions/workflows/semgrep.yml/badge.svg)](https://semgrep.dev/orgs/-/findings?repo=haboumrad/bom-changelog)
[![Known Vulnerabilities](https://snyk.io/test/github/haboumrad/bom-changelog/badge.svg)](https://snyk.io/test/github/haboumrad/bom-changelog)

# Description

This tool is a release notes generator:
- based on conventional commit parsing of github repositories
- fetching corresponding jira tickets information
- exporting the results in confluence

## How does it work ?
A release notes contains all the changes between 2 tags of a given git repository.
- Each parsed commit between the 2 tags is considered as a change.
- Commits complying to this pattern will be picked (it respects the git conventional commit convention): <TYPE>(<SCOPE>):<SUBJECT>
- Commits which do not comply to this convention will be reported as is in the changelog without further processing.

For conventional commits:
- The <TYPE> is considered as the type of the change
- The <SCOPE> is considered as the id of the change
- The <SUBJECT> is considered as the summary of the change

For each conventional commit, if the <SCOPE> identifies an existing Jira issue, then the tool will use Jira to identify the change:
- The Jira issue type is considered as the type of the change
- The Jira issue key is considered as the id of the change (Note that it correspond exactly to the <SCOPE> of the commit)
- The Jira issue summary is considered as the summary of the change

There is 2 kinds of release notes:
- System release notes contain all the 'valid' changes for a given git repository between 2 tags
- BOM release notes is more like a composite baseline of multiple git system repositories. A BOM version contains references to git repositories versions.

# Getting started
## Create a bom context
You can setup as many contexts as you want according to the number of projects you want to manage with the changelog tool.
Each context correspond to a folder in the .changelog directory of your home directory.


A context contain the necessary information for connecting to your github account, and atlassian jira/confluence account
Create the following files in a .changelog directory located in your home folder:

### ~/.changelog/<CONTEXT_NAME>/.env.command-line

| variable                     | Description                                                                                                                            | Example             | 
|------------------------------|----------------------------------------------------------------------------------------------------------------------------------------|---------------------|
| CHANGE_PROJECT_PREFIX_FILTER | Requests to jira will be made only if the matched scope of the parsed conventional commit match one of the PREFIX set in this variable | SAMPLE-PROJA-,PROJ- |

Sample file
```
CHANGE_PROJECT_PREFIX_FILTER=SAMPLE-PROJA-,PROJ-
```

### ~/.changelog/<CONTEXT_NAME>/.env.github-bom-diff-adapter

| variable     | Description                                                                                       | Example           | 
|--------------|---------------------------------------------------------------------------------------------------|-------------------|
| GITHUB_TOKEN | The github token used to parse the bom repository. It must have read access on the bom repository | TEST_GITHUB_TOKEN |

Sample file
```
GITHUB_TOKEN=TEST_GITHUB_TOKEN
```

### ~/.changelog/<CONTEXT_NAME>/.env.github-repository-commit-parser-adapter

| variable     | Description                                                                                                 | Example           | 
|--------------|-------------------------------------------------------------------------------------------------------------|-------------------|
| GITHUB_TOKEN | The github token used to parse the system repositories. It must have read access on the system repositories | TEST_GITHUB_TOKEN |

Sample file
```
GITHUB_TOKEN=TEST_GITHUB_TOKEN
```

### ~/.changelog/<CONTEXT_NAME>/.env.jira-change-management-adapter

The jira integration relies on the basic auth atlassian integration. 

More information about how obtaining the JIRA_USER and JIRA_TOKEN cab ne found d in the atlassian documentation at the following location:  https://developer.atlassian.com/cloud/jira/platform/basic-auth-for-rest-apis/


| variable   | Description | Example                       | 
|------------|-------------|-------------------------------|
| JIRA_USER  | jira user   | email                         |
| JIRA_TOKEN | jira token  | password                      |
| JIRA_URL   | jira url    | http://your-jira-instance.com |

Sample file
```
JIRA_USER=email
JIRA_TOKEN=password
JIRA_URL=http://your-jira-instance.com
```

###~/.changelog/<CONTEXT_NAME>/.env.confluence-bom-change-log-exporter-adapter

The confluence integration relies on the basic auth atlassian integration.

More information about how obtaining the CONFLUENCE_USER and CONFLUENCE_TOKEN cab ne found d in the atlassian documentation at the following location:  https://developer.atlassian.com/cloud/jira/platform/basic-auth-for-rest-apis/


| variable                     | Description                                                                                  | Example                             | 
|------------------------------|----------------------------------------------------------------------------------------------|-------------------------------------|
| CONFLUENCE_USER              | confluence user                                                                              | test@confluence.com                 |
| CONFLUENCE_TOKEN             | confluence token                                                                             | TEST_CONFLUENCE_TOKEN               |
| CONFLUENCE_URL               | confluence url                                                                               | http://your-confluence-instance.com |
| CONFLUENCE_BOMS_SPACE_ID     | confluence space id. Can be obtain via https://YOURURL.atlassian.net/wiki/rest/api/space/KEY | 65636                               |
| CONFLUENCE_BOMS_SPACE_KEY    | confluence space key                                                                         | SD                                  |
| CONFLUENCE_BOMS_PAGE_ID      | the parent page use to store generated bom pages                                             | http://your-confluence-instance.com |
| CONFLUENCE_SYSTEMS_SPACE_ID  | confluence space id. Can be obtain via https://YOURURL.atlassian.net/wiki/rest/api/space/KEY | 65636                               |
| CONFLUENCE_SYSTEMS_SPACE_KEY | confluence space key                                                                         | SD                                  |
| CONFLUENCE_SYSTEMS_PAGE_ID   | the parent page use to store generated system pages                                          | http://your-confluence-instance.com |

Sample file
```
CONFLUENCE_USER=test@confluence.com
CONFLUENCE_TOKEN=TEST_CONFLUENCE_TOKEN
CONFLUENCE_URL=https://test.confluence.atlassian.net

CONFLUENCE_SYSTEMS_SPACE_ID=65636
CONFLUENCE_SYSTEMS_SPACE_KEY=SD
CONFLUENCE_SYSTEMS_PAGE_ID=33231

CONFLUENCE_BOMS_SPACE_ID=65636
CONFLUENCE_BOMS_SPACE_KEY=SD
CONFLUENCE_BOMS_PAGE_ID=131097
```

## Create a bom repository
A bom is like a composite baseline of multiple system tags. It muste be stored in a bom.yml file located at the root of you bom git repository

A working bom example can be found here: https://github.com/haboumrad/bom-sample

Sample bom file:
```
systems:
  - name: sample-sys-1
    version: 0.0.4
    url: haboumrad/sample-sys-1
  - name: sample-sys-2
    version: v0.0.1
    url: haboumrad/sample-sys-2
```
The corresponding targeted repositories can be found here:
- https://github.com/haboumrad/sample-sys-1
- https://github.com/haboumrad/sample-sys-2



## Run the application
here is an example of run using the bom-sample repository created for demonstration purpose.
You can use it to test the changelog generation.

The command line take simply the bom repository information required to generate the changelog (url, from and to version).

The label is used for the bom page name generated in confluence 

### Running the command line in dev mode
```
 export BOM_CONTEXT=local && npm run start:dev -- generate --repo-label bom-sample --repo-name haboumrad/bom-sample --from 0.0.2 --to 0.0.3
```

### Running the command line using the cli
install the changelog-cli command line using the following command
```
npm i -g @haboumrad/bom-changelog
```
Run the command line
```
export BOM_CONTEXT=local && changelog-cli generate --repo-label bom-sample --repo-name haboumrad/bom-sample --from 0.0.2 --to 0.0.3
```

### Corresponding result in confluence:

![hierarchy generated in confluence](https://github.com/haboumrad/bom-changelog/blob/main/docs/bom-1-overview.png)

![bom release note generated in confluence (with active link to jira and github)](https://github.com/haboumrad/bom-changelog/blob/main/docs/bom-1-bom-release-note.png)

![system release note generated in confluence (with active link to jira and github)](https://github.com/haboumrad/bom-changelog/blob/main/docs/bom-1-system-release-note.png)


# License
bom-changelog is [MIT licensed](LICENSE).


[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fhaboumrad%2Fbom-changelog.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fhaboumrad%2Fbom-changelog?ref=badge_large)