import {Cached} from '../src';
import { expect } from 'chai';

describe('Decorators', function() {
    it('cacheBasic', function() {

        class Foo {
            static counter = 0;
            @Cached()
            bar() {
               return ++Foo.counter;
            }
        }

        const foo = new Foo();
        const foo2 = new Foo();
        let cache = foo.bar();
        let cache2 = foo.bar();

        let cache3 = foo2.bar();

        // Shared object
        expect(cache).equal(1);
        expect(cache2).equal(1);

        // new object, so new cache, but static value increases
        expect(cache3).equal(2);
    });
});