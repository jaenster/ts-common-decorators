[![npm version](https://d25lcipzij17d.cloudfront.net/badge.svg?id=js&type=6&v=0.9.10)](https://www.npmjs.com/package/ts-common-decorators) ![CI](https://github.com/jaenster/ts-common-decorators/workflows/CI/badge.svg)

# Common decorators

Just some decorators that don't need any dependencies, yet are very handy.

# Observe
Just a simple non recursive observer, very handy for simple use cases
```typescript
import {Observe} from 'ts-common-decorators'
import Axios from 'axios';
class Model {
    public id: number;
    
    @Observe(Model.prototype.toBackend)
    public someField: string = '';
    
    
    toBackend() {
        Axios.post('/model/put/'+this.id,this);
    }
}

const model = new Model();
model.someField = 'some data';
```

# Cached
Why call should we call this twice?
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

# QueuedPromise
Javascript is async, but not everything is javascript. From time to time, you want a promise that is queued. Without making a massive callback hell
```typescript
import {QueuedPromise} from 'ts-common-decorators';
class Person {
    name: string;
    constructor(name: string) {
        this.name = name
    }

    @QueuedPromise()
    async assignTask(task: string) : Promise<any> {
        console.log('['+this.name+'] start: '+task); // did task
        // wait 300 ms to simulate some "work"
        await new Promise(resolve => setTimeout(() => resolve(),300));
        console.log('['+this.name+'] done: '+task); // did task
    }

}

const alice = new Person('alice');
const bob = new Person('bob');
[alice,bob].forEach((self,i,everyone) => {
    self.assignTask('write code');
    self.assignTask('test code');
    self.assignTask('fix bug');
    self.assignTask('commit code');
    self.assignTask('push code').then(() => everyone[1-i].assignTask('review code'));
});
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