[![npm version](https://d25lcipzij17d.cloudfront.net/badge.svg?id=js&type=6&v=0.9.8)](https://www.npmjs.com/package/ts-common-decorators) ![CI](https://github.com/jaenster/ts-common-decorators/workflows/CI/badge.svg)

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

# Promise once
Don't you hate it to see something is promises twice at the same time? If functions are requesting a model, its sad it retrieves it twice from the database. So, @PromiseOnce ensures you it only fetches it once

Take a look at the example. While only 2 requests will take place, /model/1 and /model/7. While model 1 is called twice
```typescript
import {PromiseOnce} from 'ts-common-decorators';
import Axios from 'axios';

class Foo {
    @PromiseOnce
    bar(id? :number) {
        return Axios({
            method: 'get',
            url: '/model/'+id,
        })
    }
}

const foo = new Foo();

const fetch1 = foo.bar(1), 
    fetch2 = foo.bar(1),

// Fetching another model
    fetch3 = foo.bar(7);

Promise.all([fetch1,fetch2,fetch3]).then(data => {
    // Both fetch 1 and 2 are a request for model's instance 1.
    console.log('fetch 1 and 2 refer to the same object?', data[0] === data[1]); // true

    // fetch 3 is a request for model's instance 7.
    console.log('fetch 1 and 3 refer to the same object?',data[0] === data[2]); // false
});
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