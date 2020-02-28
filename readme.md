[![npm version](https://d25lcipzij17d.cloudfront.net/badge.svg?id=js&type=6&v=0.9.5)](https://www.npmjs.com/package/ts-common-decorators) ![CI](https://github.com/jaenster/ts-common-decorators/workflows/CI/badge.svg)

# Common decorators

Just some decorators that don't need any dependencies, yet are very handy.

# Cached
Why call this 
```typescript
import {Cached} from 'ts-common-decorators';
import Axios from 'axios';

class Foo {
    @Cached()
    bar(id: number|string): Promise<any> {
        return Axios({
            method: 'get',
            url: '/model/'+id,
        })
    }
}

const foo = new Foo;

const model1 = foo.bar(1); // Logs first time called
const model1Again = foo.bar(1); // Doesnt fetch model1 again, its cached!

console.log(model1 === model1Again); // true, refers to the same object
```

# Static
Sometimes you see these purely static classes. Its better to make them safe so they cant be created
```typescript
import {Static} from 'ts-common-decorators';

@Static
class Foo {
    static bar() {
    
    }
}

// Error, can't call new on a static class
const foo = new Foo;
```

# Metadata
Give a method some metadata
```typescript
import {MetaData} from 'ts-common-decorators';

class Foo {
    @MetaData({something: 'special'})
    bar() {
    
    }
}
const foo = new Foo();

console.log(MetaData.get(foo.bar).something); // special
```

# Logger
Getting tired of figuring out if a method gets called while changing it? 

```typescript
import {Logger} from 'ts-common-decorators'


class Foo {
    @Logger(() => console.log('called Foo.bar'))
    bar() {
    
    }
}
const foo = new Foo();
foo.bar(); // Logs it on the console. Handy debug function
```
# More
More to come in the future