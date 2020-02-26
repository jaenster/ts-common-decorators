[![npm version](https://d25lcipzij17d.cloudfront.net/badge.svg?id=js&type=6&v=0.9.1)](https://www.npmjs.com/package/ts-common-decorators) ![CI](https://github.com/jaenster/ts-common-decorators/workflows/CI/badge.svg)

# Common decorators

Just some decorators that don't need any dependencies, yet are very handy.

# Cached
```typescript
import {Cached} from 'ts-common-decorators';

class Foo {
    @Cached()
    bar() {
       console.log('First time called, doing request');
       return 'cached value';
    }
}

const foo = new Foo;

foo.bar(); // Logs first time called
foo.bar(); // Doesnt log that, as the value is cached now

const foo2 = new Foo;
foo2.bar(); // Logs first time called
```

# More
More to come in the future