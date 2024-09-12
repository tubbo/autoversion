import { getOctokit } from "@actions/github";
import type { Service, Release } from "./service.js";

type LatestReleases = {
  repository: {
    releases: {
      latest: Release[];
    };
  };
};

type PullRequest = {
  author: {
    login: string;
  };
  labels: {
    nodes: { name: string }[];
  };
  files: {
    changed: { path: string }[];
  };
};

type UnreleasedPullRequests = {
  search: {
    pulls: PullRequest[];
  };
};

/**
 * GitHub.
 */
export class GitHub implements Service {
  client: ReturnType<typeof getOctokit>;
  owner: string;
  repo: string;

  constructor(token: string, owner: string, repo: string) {
    this.client = getOctokit(token);
    this.owner = owner;
    this.repo = repo;
  }

  async latest() {
    const {
      repository: {
        releases: {
          latest: [release],
        },
      },
    } = await this.client.graphql<LatestReleases>(
      `
      query LatestReleases($owner: String!, $repo: String!, $draft: Boolean!) {
        repository(owner: $owner, name: $repo) {
          releases(orderBy: CREATED_AT, draft: $draft) {
            latest: nodes {
              id
              version: tagName
              date: createdAt
            }
          }
        }
      }
    `,
      { owner: this.owner, repo: this.repo },
    );

    return release;
  }

  async diff(since: Release) {
    let query = `repo:${this.owner}/${this.repo} is:pr is:merged`;

    if (since) query += ` closed:>${since.date}`;

    const {
      search: { pulls },
    } = await this.client.graphql<UnreleasedPullRequests>(
      `
      query UnreleasedPullRequests($query: String!) {
        search(query: $query, type: ISSUE) {
          pulls: nodes {
            ... on PullRequest {
              author {
                login
              }
              labels {
                nodes {
                  name
                }
              }
              files {
                changes: nodes {
                  path
                }
              }
            }
          }
        }
      }    
    `,
      { query },
    );
    const changes = pulls.map(({ author, labels, files }) => ({
      author: author.login,
      labels: labels.nodes.map(({ name }) => name),
      paths: files.changed.map(({ path }) => path),
    }));

    return changes;
  }
}
