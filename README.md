![GitHub](https://img.shields.io/github/license/haboumrad/bom-changelog)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fhaboumrad%2Fbom-changelog.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fhaboumrad%2Fbom-changelog?ref=badge_shield)

![build and test](https://github.com/haboumrad/bom-changelog/actions/workflows/node.js.yml/badge.svg)
[![codecov](https://codecov.io/gh/haboumrad/bom-changelog/branch/main/graph/badge.svg?token=XB6USKQJPY)](https://codecov.io/gh/haboumrad/bom-changelog)
[![semgrep](https://github.com/haboumrad/bom-changelog/actions/workflows/semgrep.yml/badge.svg)](https://semgrep.dev/orgs/-/findings?repo=haboumrad/bom-changelog)
[![Known Vulnerabilities](https://snyk.io/test/github/haboumrad/bom-changelog/badge.svg)](https://snyk.io/test/github/haboumrad/bom-changelog)

# Description

This tool generates a confluence changelog based on gitHub commits and jira.

# TODO
- complete documentation: README, architecture description and extensibility
- error handling
- add command line support (for now arguments are fetched from env vars)
- add support for removing system from a BOM version
- add tests
  - bom generation with new, updated and unchanged systems
  - Error code returned by http adapters
  - multiple conventional commits with the same scope should lead to only one changelog line
  - generation of changelog with commit having valid jira issue
  - generation of changelog with commit having unknown jira issue
  - do not call jira when the change does not match the configured projects
  - do not generate system pages when system is unchanged

# License
bom-changelog is [MIT licensed](LICENSE).


[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fhaboumrad%2Fbom-changelog.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fhaboumrad%2Fbom-changelog?ref=badge_large)