# DTO Transformation Feature Samples

NestJS and TypeScript excerpts demonstrating reusable request-field conversion and nested DTO validation.

## Purpose

These samples show how I combine shared input normalization with domain-specific validation rules rather than repeating conversion logic in request handlers.

## Field Transformation Decorator

**Source:** [rpc-request-field.decorator.ts](./features/rpc-request-field.decorator.ts)

Combines class-transformer Transform and optional Expose decorators.

- Applies configured defaults to undefined and selected empty values.
- Optionally preserves null values.
- Supports boolean and numeric conversion, JSON parsing, ISO-date conversion through Luxon, and array deduplication through Set.
- Returns the default value for failed JSON parsing, invalid dates, or unsuitable array inputs.
- Allows callers to disable empty-value conversion or exposure metadata.

**What this demonstrates:** encapsulating recurring conversion policy behind a declarative property decorator.

**Behavior boundaries:** numeric zero is considered empty by default, while false is preserved. Boolean string handling is case-sensitive and explicitly recognizes only false, off, and 0. Number conversion may produce NaN, so validation remains necessary. Array deduplication uses JavaScript equality rather than structural object comparison. Expose behavior depends on surrounding class-transformer options.

## Request Envelope DTO

**Source:** [rpc-request.dto.ts](./features/rpc-request.dto.ts)

Defines nested header validation, including UUID checks for trace and mobile identifiers, optional version strings, and an optional platform enum. The abstract envelope declares object and nested-validation requirements for user and payload fields.

**What this demonstrates:** validating transport metadata separately from domain payloads.

## Generic User DTO

**Source:** [rpc-request-generic.dto.ts](./features/rpc-request-generic.dto.ts)

Adds optional user metadata and validates supplied roles against the combined system, mobile, admin, and partner role vocabulary. Uses Type metadata to instantiate the nested user DTO.

**What this demonstrates:** sharing a user-envelope contract across multiple request types.

## List Request Example

**Source:** [get-taxpayer-list-request.dto.ts](./features/get-taxpayer-list-request.dto.ts)

- Converts page and pageSize inputs to numbers with defaults of one and ten.
- Applies minimum and maximum numeric bounds.
- Validates optional search and sorting values.
- Uses Type and ValidateNested for list parameters and typed payload construction.
- Extends the generic RPC envelope with its domain payload.

**What this demonstrates:** composing normalization, field validation, nested payloads, and shared envelopes into a request contract.

**Behavior boundary:** IsNumber does not enforce integer pagination. With default empty-value conversion, numeric zero becomes the configured default before validation, whereas a string zero is converted to zero. Original taxpayer-domain identifiers are preserved; no taxpayer records are included.

## Technologies

TypeScript, NestJS decorator composition, class-transformer, class-validator, and Luxon.

## Excerpt Context

Shared interfaces, enums, compiler settings, dependency versions, and the validation pipe belong to the surrounding workspace. Runtime behavior depends on invoking transformation and validation with suitable options; types alone do not validate messages.

Original contents and imports are preserved, with files grouped for portfolio review. Descriptions are based on source inspection; no DTO transformations or builds were executed for this collection.

## Portfolio Message

I can organize request boundaries through reusable conversion policies, nested DTO composition, and explicit field-validation rules.
