# JS Fixture
![Tests](https://github.com/js-fixture/core/actions/workflows/tests.yml/badge.svg)
[![npm version](https://img.shields.io/npm/v/%40js-fixture/core.svg)](https://www.npmjs.com/package/@js-fixture/core)

JsFixture is a TypeScript-first fixture library for generating customizable test data.

It helps you create test data quickly and consistently by defining "recipes" that describe how to build your test objects. These recipes can be customized, combined, and reused across your test suite.

## Installation

```bash
npm install @js-fixture/core --save-dev
```

## Quick Start

### Basic Usage

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

### Creating Variants

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
                        .createFactory
                        .withVariants(adminRecipe, inactiveUserRecipe)
                        .create();

// Use variants - Method 2
const admin = adminRecipe.createFactory().create();
const inactiveUser = inactiveUserRecipe.createFactory().create();
```

### Runtime Overrides

```typescript
const userFactory = userRecipe.createFactory();

// Override specific properties at creation time
const customUser = userFactory.create({
  name: 'Custom Name',
  email: 'custom@example.com'
});

// Create multiple with same overrides
const inactiveUsers = userFactory.createMany(5, {
  isActive: false
});
```

### Nested Fixtures

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

### Included Utilities

* `pickFromArray`
```typescript
import { pickFromArray } from 'js-fixture';

const userRecipe = JsFixture.defineRecipe<User>((ctx) => ({
  id: ctx.autoIncrement(),
  name: 'Alice',
  role: pickFromArray(['admin', 'user', 'moderator'])
}));
```

* `pickFromEnum`
```typescript
import { pickFromArray } from 'js-fixture';

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

### Configuration

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
