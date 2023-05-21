# Description
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fhaboumrad%2Fbom-changelog.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fhaboumrad%2Fbom-changelog?ref=badge_shield)


This project enable to generate changelog using gitHub, jira and confluence.
This is the very first version of this project. It is still in progress.

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
- add CI pipeline

# License
bom-changelog is [MIT licensed](LICENSE).


[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fhaboumrad%2Fbom-changelog.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fhaboumrad%2Fbom-changelog?ref=badge_large)