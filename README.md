# JS Fixture
![Tests](https://github.com/js-fixture/core/actions/workflows/tests.yml/badge.svg)
[![npm version](https://img.shields.io/npm/v/%40js-fixture/core.svg)](https://www.npmjs.com/package/@js-fixture/core)

JsFixture is a TypeScript-first fixture library for generating customizable test data.

It helps you create test data quickly and consistently by defining "recipes" that describe how to build your test objects. These recipes can be customized, combined, and reused across your test suite.

## Installation

```bash
npm install @js-fixture/core --save-dev
```

## Quick Notes

Note that while we are not planning any breaking changes before the first stable release (1.0.0), the API may still evolve as we gather feedback.

If you'd like to report anything or if you have any question, please feel free to open a discussion/issue on the [JS Fixture repository](https://github.com/js-fixture/core).

Thanks!

## Quick Start

### Basic Usage

In a nutshell, here is how to use the library to create fixtures:

```typescript
import { JsFixture } from '@js-fixture/core';

// Define a recipe for a User
const userRecipe = JsFixture.defineRecipe<User>((ctx) => ({
  id: ctx.autoIncrement(),
  name: 'John Doe',
  email: 'john@example.com',
  createdAt: new Date()
}));

// Create a factory and generate users
const userFactory = userRecipe.createFactory();

const user = userFactory.create();
// { id: 1, name: 'John Doe', email: 'john@example.com', createdAt: Date }

const users = userFactory.createMany(3);
// Array of 3 users
```

See the Recommended Usage below for best practices.

## Recommended Usage

### 1. Organize Recipes in a Dedicated Directory

Keep your fixture recipes organized by placing them in a dedicated directory structure.

```typescript
// testing/fixtures/user-recipe.ts
import { JsFixture } from '@js-fixture/core';

export const userRecipe = JsFixture.defineRecipe<User>((ctx) => ({
  id: ctx.autoIncrement(),
  name: 'John Doe',
  email: 'john@example.com',
  createdAt: new Date()
}));
```

### 2. Create Fresh Factory Instances Per Test

Create new factory instances in your test setup rather than sharing a single factory across your entire codebase. This ensures predictable behavior for stateful features like auto-incrementing counters.

```typescript
// src/services/user-service.test.ts
import { userRecipe } from 'testing/fixtures/user-recipe';
import { FixtureFactory } from '@js-fixture/core';

describe('UserService', () => {
  let userFactory: FixtureFactory<User>;

  beforeEach(() => {
    userFactory = userRecipe.createFactory();
  });

  it('creates a user with incremental ID', () => {
    const user1 = userFactory.create();
    const user2 = userFactory.create();
    
    expect(user1.id).toBe(1);
    expect(user2.id).toBe(2);
  });

  it('starts fresh in each test', () => {
    const user = userFactory.create();
    expect(user.id).toBe(1);
  });
});
```

### 3. Use Context for Nested Recipes

When composing recipes that depend on other recipes, use `ctx.fromRecipe()` instead of calling `recipe.createFactory()`. This ensures that when calling `parentFactory.create()`, the same context will be used to create the nested fixtures.

```typescript
const addressRecipe = JsFixture.defineRecipe<Address>((ctx) => ({
  id: ctx.autoIncrement(),
  street: '123 Main St',
  city: 'Anytown',
  zipCode: '12345'
}));

const userRecipe = JsFixture.defineRecipe<User>((ctx) => ({
  id: ctx.autoIncrement(),
  name: 'John Doe',
  email: 'john@example.com',
  address: ctx.fromRecipe(addressRecipe).create(),
}));

const userFactory = userFactory.create();
const user1 = userFactory.create();
const user2 = userFactory.create();

expect(user1.address.id).toBe(1);
expect(user2.address.id).toBe(2); // Would be 1 if `ctx.fromRecipe` had not been used
```

## Recipe Variants

Create specialized variants of a base recipe:

```typescript
// Base user recipe
const userRecipe = JsFixture.defineRecipe<User>((ctx) => ({
  id: ctx.autoIncrement(),
  name: 'John Doe',
  role: 'user',
  isActive: true
}));

// Create specialized variants
const adminRecipe = userRecipe.variant({
  role: 'admin'
});

const inactiveUserRecipe = userRecipe.variant({
  isActive: false,
  deactivatedAt: new Date()
});

// Use variants - Method 1
const inactiveAdmin = userRecipe
                        .createFactory()
                        .withVariants(adminRecipe, inactiveUserRecipe)
                        .create();

// Use variants - Method 2
const admin = adminRecipe.createFactory().create();
const inactiveUser = inactiveUserRecipe.createFactory().create();
```

## Runtime Overrides

Override specific properties at creation time:

```typescript
const userFactory = userRecipe.createFactory();

const customUser = userFactory.create((ctx) => ({
  name: 'Custom Name',
  email: 'custom@example.com'
}));

// Create multiple with same overrides
const inactiveUsers = userFactory.createMany(5, (ctx) => ({
  isActive: false
)});
```

## Nested Fixtures

You can compose recipes that depend on other recipes using `ctx.fromRecipe()`:

```typescript
// Define related recipes
const addressRecipe = JsFixture.defineRecipe<Address>((ctx) => ({
  id: ctx.autoIncrement(),
  street: '123 Main St',
  city: 'Anytown',
  zipCode: '12345'
}));

const userRecipe = JsFixture.defineRecipe<User>((ctx) => ({
  id: ctx.autoIncrement(),
  name: 'John Doe',
  // Create nested fixtures
  address: ctx.fromRecipe(addressRecipe).create(),
  // Create arrays of nested fixtures
  previousAddresses: ctx.fromRecipe(addressRecipe).createMany(2)
}));
```

## Included Utilities

### `ctx.autoIncrement(key?:string)`

Generates an auto-incrementing number. Accepts an optional key.

```typescript
const fooRecipe = JsFixture.defineRecipe<Foo>((ctx) => ({
  id: ctx.autoIncrement(),
  otherId: ctx.autoIncrement(),
}));
const barRecipe = JsFixture.defineRecipe<Bar>((ctx) => ({
  id: ctx.autoIncrement(),
  otherId: ctx.autoIncrement('my-key'),
}));

// Examples
const fooFactory = fooRecipe.createFactory();
console.log(fooFactory.create()); // { id: 1, otherId: 2}
console.log(fooFactory.create()); // { id: 3, otherId: 4}

const barFactory = fooRecipe.createFactory();
console.log(barFactory.create()); // { id: 1, otherId: 1}
console.log(barFactory.create()); // { id: 2, otherId: 2}
```

### `pickFromArray`

Randomly selects and returns one element from the provided array.

```typescript
import { pickFromArray } from '@js-fixture/core';

const userRecipe = JsFixture.defineRecipe<User>((ctx) => ({
  id: ctx.autoIncrement(),
  name: 'Alice',
  role: pickFromArray(['admin', 'user', 'moderator'])
}));
```

### `pickFromEnum`

Randomly selects and returns one value from the provided enum.

```typescript
import { pickFromArray } from '@js-fixture/core';

enum UserRole {
    Admin,
    User,
    Moderator
}

const userRecipe = JsFixture.defineRecipe<User>((ctx) => ({
  id: ctx.autoIncrement(),
  name: 'Alice',
  role: pickFromEnum(UserRole)
}));
```

## Configuring JS Fixture

```typescript
// Configure global settings
JsFixture.configure({
  array: {
    min: 2,    // Minimum array length for createMany()
    max: 8     // Maximum array length for createMany()
  }
});
```

## TypeScript Support

JS Fixture is built with TypeScript and provides full type safety:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

// Recipe is fully typed
const userRecipe = JsFixture.defineRecipe<User>((ctx) => ({
  id: ctx.autoIncrement(),    // number
  name: 'John',               // string
  email: 'john@example.com'   // string
  // unknownProperty: 'not allowed'   // TypeScript error
}));

// Factory methods are typed
const factory = userRecipe.createFactory();
const user: User = factory.create();  // Correctly typed as User
```
