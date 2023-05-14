# Description

This project enable to generate changelog using gitHub, jira and confluence.
This is the very first version of this project. It is still in progress.

# TODO
- complete documentation: README, architecture description and extensibility
- error handling
- add jira project supported to the JIRA extractor in order to avoid a remote call when the scope does not match the id project prefix
- add command line support (for now arguments are fetched from env vars)
- add support for removing system from a BOM version
- add tests
  - bom generation with new, updated and unchanged systems
  - Error code returned by http adapters
  - multiple conventional commits with the same scope should lead to only one changelog line
  - generation of changelog with commit having valid jira issue
  - generation of changelog with commit having unknown jira issue
- add CI pipeline

# License
bom-changelog is [MIT licensed](LICENSE).
