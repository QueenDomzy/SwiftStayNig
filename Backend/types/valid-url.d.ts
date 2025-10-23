declare module "valid-url" {
  /**
   * Returns the input URL if it is a valid HTTP/HTTPS URI, otherwise undefined.
   */
  export function isWebUri(url: string): string | undefined;

  /**
   * Returns the input URL if it is a valid URI (any scheme), otherwise undefined.
   */
  export function isUri(url: string): string | undefined;

  /**
   * Returns true if the input string is a valid URI, false otherwise.
   */
  export function isUriStrict(url: string): boolean;

  /**
   * Returns true if the input string is a valid HTTP/HTTPS URI, false otherwise.
   */
  export function isHttpUri(url: string): boolean;
  export function isHttpsUri(url: string): boolean;
}
