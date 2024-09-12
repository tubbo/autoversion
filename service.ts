/**
 * A set of changes that occurred on the service.
 */
export type Changeset = {
  author: string;
  labels: string[];
  // paths: string[];
};

/**
 * A published release on the service.
 */
export type Release = {
  id: string;
  name: string;
  date: string;
};

/**
 * Base class for service implementations to fetch data.
 */
export abstract class Service {
  /**
   * Find the latest `Release` published on this service.
   */
  abstract latest(): Promise<Release>;

  /**
   * Find all pull requests merged since the provided `Release`.
   */
  abstract diff(since?: Release): Promise<Changeset[]>;
}
