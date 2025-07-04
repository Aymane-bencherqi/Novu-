import { ApiHeaderOptions } from '@nestjs/swagger';
import { WithRequired, testHttpHeaderEnumValidity } from './utils.types';

export enum HttpRequestHeaderKeysEnum {
  AUTHORIZATION = 'Authorization',
  USER_AGENT = 'User-Agent',
  CONTENT_TYPE = 'Content-Type',
  SENTRY_TRACE = 'Sentry-Trace',
  BAGGAGE = 'Baggage',
  NOVU_ENVIRONMENT_ID = 'Novu-Environment-Id',
  NOVU_API_VERSION = 'Novu-API-Version',
  NOVU_USER_AGENT = 'Novu-User-Agent',
  BYPASS_TUNNEL_REMINDER = 'Bypass-Tunnel-Reminder',
  IDEMPOTENCY_KEY = 'Idempotency-Key',
  NOVU_APPLICATION_IDENTIFIER = 'Novu-Application-Identifier',
}
testHttpHeaderEnumValidity(HttpRequestHeaderKeysEnum);

export enum HttpResponseHeaderKeysEnum {
  CONTENT_TYPE = 'Content-Type',
  RATELIMIT_REMAINING = 'RateLimit-Remaining',
  RATELIMIT_LIMIT = 'RateLimit-Limit',
  RATELIMIT_RESET = 'RateLimit-Reset',
  RATELIMIT_POLICY = 'RateLimit-Policy',
  RETRY_AFTER = 'Retry-After',
  IDEMPOTENCY_KEY = 'Idempotency-Key',
  IDEMPOTENCY_REPLAY = 'Idempotency-Replay',
  LINK = 'Link',
}
testHttpHeaderEnumValidity(HttpResponseHeaderKeysEnum);

export type HeaderObject = WithRequired<
  Omit<ApiHeaderOptions, 'name'>,
  'required' | 'description' | 'schema' | 'example'
>;
export type HeaderObjects = Record<HttpResponseHeaderKeysEnum, HeaderObject>;
