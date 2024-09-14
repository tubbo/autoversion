# Contributing to `tubbo/autoversion`

Thanks for your interest in contributing to Autoversion! This GitHub Action is
written in [TypeScript](https://typescriptlang.org) and run in [NodeJS](https://nodejs.org). The following guide will help you get started creating issues and
potentially making pull requests!

## Issues and Discussions

This project distinguishes between the role of issues and discussions. Whereas
issues are for **planned work that has been committed to**, discussions are for
**new ideas, feature requests, and release announcements**. Therefore, most
contributions related to new suggestions or new feature requests should go
into the discussion forum. This allows anyone to participate, and prevents
cluttering the issues tab with work that may never get completed.

Basically, if you're experiencing a problem, make an issue. If you're suggesting
something new, make a discussion. Discussions will be converted into issues if
and when they are planned for eventual completion.

## Contributing Code

All contributions to the repository must be made in the form of a pull request,
with a descriptive title and body. Pull requests are used by the changelog and
release notes generator to communicate what changed in the project, so they
should be considered "outward-facing" material. Labels for pull requests can be
optionally added, but can also be changed by a maintainer if they need to.

### Local Setup

Before setting up, make sure you have the following installed:

- NodeJS v20
- Yarn v1

Clone this repository:

```sh
git clone https://github.com/tubbo/autoversion.git && cd autoversion
```

Install dependencies:

```sh
yarn install --frozen-lockfile
```

You should now be able to build the action:

```sh
yarn build
```

To make sure your changes will pass CI, run the automated tests locally:

```sh
yarn test
```

You can also ensure that your code is formatted correctly:

```sh
yarn lint
```

If the kint tools detect problems, you can try automatically formatting the
code to conform to our style guide:

```sh
yarn fmt
```

## Releasing

If there were any relevant changes, a new release is cut every Monday afternoon
at 2pm EST. Pull Requests must include a versioning label in order to bump the
version, which correspond to the GitHub Changelog categories in the config. For
reference, here's how the version will update when the following labelled PRs
are merged:

- **major** version changes use the `breaking` label.
- **minor** version changes use the `enhancement` label.
- **patch** version changes use the `bug` or `dependencies` labels.

Releases can also be triggered manually via the `workflow_dispatch:` event,
though this should only occur in special circumstances such as a critical
security update.

### Release Tags

Since GitHub Actions relies on tags for versioning, we create multiple tags
corresponding to the latest changes on each major/minor version. For example,
when `v1.1.5` is released, the `v1`, `v1.1`, and `v1.1.5` tags will be updated.
This allows consumers of the action to pin their workflows to a major version
release, and since we follow semantic versioning, this communicates a breaking
change.
