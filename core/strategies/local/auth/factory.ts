import { RequestClient } from "../../../../types";
import { RESTInterfaceType } from "./types";
import { AuthProvider } from "./base";
import { DEFAULT_ENDPOINTS } from "./default";
import { host } from "../../../helpers";

/**
 * Auth provider factory function
 */
export function createAuthProvider(
  client: RequestClient,
  endpoints?: Partial<RESTInterfaceType>,
  _host?: string | null | undefined
) {
  const _endpoints = { ...DEFAULT_ENDPOINTS, ...(endpoints ?? {}) };

  const isValidURL = (value: string) => {
    try {
      const _url = new URL(value);
      return typeof _url.protocol !== "undefined" && _url.protocol !== null;
    } catch {
      return false;
    }
  };

  if (_host) {
    for (const prop of Object.keys(_endpoints)) {
      const _value = _endpoints[prop as keyof typeof _endpoints];
      if (!isValidURL(_value)) {
        _endpoints[prop as keyof typeof _endpoints] = `${host(_host)}/${
          _value.startsWith("/") ? _value.substring(1) : _value
        }`;
      }
    }
  }

  // Returns the auth provider instance
  return new AuthProvider(client, _endpoints);
}
