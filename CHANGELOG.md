# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Custom `PlausibleApiError` class for better error handling with `statusCode` and `response` properties
- CI workflow for automated testing on pull requests and pushes to main
- JSDoc examples for complex types (`DateRange`, `SimpleFilter`, `LogicalFilter`, `Filter`)
- Dedicated `QueryResponseMeta` interface for response metadata
- Example documentation for `QueryResponse` type

### Changed
- Error handling now throws `PlausibleApiError` instead of generic `Error`
- Improved JSDoc documentation throughout type definitions

### Removed
- Unused `rateLimit` property from `PlausibleClient` (rate limiting is consumer's responsibility)

## [0.1.0] - 2025-01-XX

### Added
- Initial release
- Full TypeScript client for Plausible Stats API v2
- Support for metrics, dimensions, and filters
- Complex filter DSL with logical operators (and, or, not)
- Comprehensive test coverage (36 tests)
- OpenAPI specification for the Plausible Stats API
- GitHub Actions workflow for automated publishing to JSR

[Unreleased]: https://github.com/metron-us/plausible/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/metron-us/plausible/releases/tag/v0.1.0
