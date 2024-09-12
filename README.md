# Automatic Version Generation Action

Generate versions based on your GitHub Automatic Release Notes Generation
configuration. This action will create a new release with generated notes
and apply a version based on the latest release and any unreleased pull
requests that have been merged matching the labels you specified in config.

The outputs exposed by this action are:

- **bump:** The version bump type or an empty string if nothing to update.
- **bumped:** Whether the version was bumped.
- **last:** The last released version, if found.
- **next:** The next version to be published, if one is needed.
- **major:** The next major version to be published, if one is needed.
- **minor:** The next minor version to be published, if one is needed.
- **patch:** The next patch version to be published, if one is needed.

And it takes the following optional inputs:

- **token:** GitHub token. Default: `${{ github.token }}`

## Usage

Configure your **.github/release.yml** with an additional setting for each
category, `version`, which determines the version bump of the category when its
labels are encountered in a pull request. Possible values include:

- `major`
- `minor`
- `patch`

Here's an example config for reference:

```yaml
# yaml-language-server: $schema=https://tubbo.github.io/autoversion/schema.json
changelog:
  excludes:
    authors:
      - dependabot[bot]
      - renovate[bot]
    labels:
      - dependencies
  categories:
    - title: Breaking Changes
      labels: [breaking]
      # Changes in this category will trigger a major version update
      version: major
    - title: New Features
      labels: [feature]
      # Changes in this category will trigger a minor version update
      version: minor
    - title: Bug Fixes and Improvements
      labels: [bug, enhancement]
      # Changes in this category will trigger a patch version update
      version: patch
    - title: Other Changes
      # This category will be ignored since no `version:` is specified
      labels: ["*"]
      exclude:
        authors:
          - github-actions[bot]
        labels:
          - documentation
```

Both global and category-level `excludes:` are respected.

You can now use the `autoversion` action in your release workflow:

```yaml
name: Release
on:
  workflow_dispatch:
steps:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
      - uses: fregante/setup-git-user@v2
      - uses: tubbo/autoversion@v1
        id: version
      - uses: softprops/action-gh-release@v2
        if: steps.version.outputs.bumped == "true"
        with:
          generate_notes: true
```

The `autoversion` action doesn't make any changes to your source code, but it
does output information that you'll need in order to create a new release. You
can check the `bumped` output to see if a new release is needed, and then use
the `bump` or `next` / `last` outputs to generate your new release with CLI
tools.
