import {Cached} from '../bin';
import {expect} from 'chai';

describe('cache', function () {

    it('cacheBasicUnique', function () {
        class Foo {
            static counter = 0;

            @Cached({uniquePerKey: true})
            bar(id ?: number) {
                return ++Foo.counter;
            }
        }


        const foo = new Foo;
        let cache, cache2;

        cache = foo.bar(1);
        cache2 = foo.bar(2);

        expect(cache).equal(1);
        expect(cache2).equal(2);
    });

    it('cacheBasicNonUnique', function () {
        class Foo {
            static counter = 0;

            @Cached({uniquePerKey: true})
            bar(id ?: number) {
                return ++Foo.counter;
            }
        }

        const foo = new Foo;
        let cache, cache2;

        cache = foo.bar(1);
        cache2 = foo.bar(1);

        expect(cache).equal(1);
        expect(cache2).equal(1);
    });


    it('cacheThrownException', function () {
        class Foo {
            static counter = 0;

            @Cached({uniquePerKey: true})
            bar(id ?: number) {
                ++Foo.counter;
                if (Foo.counter === 1) {
                    throw Error();
                }
                return Foo.counter;
            }
        }

        const foo = new Foo;
        let cache, cache2;

        try {
            cache = foo.bar(1);
        } catch (e) {

        }
        cache2 = foo.bar(1);

        // First time it throws an error, so it doesnt give any value back.
        expect(cache).equal(undefined);

        // Second time, cache shouldn't be set, so it should result in 2.
        expect(cache2).equal(2);
    });


    it('cacheNoUniqueKey', function () {
        class Foo {
            static counter = 0;

            @Cached({uniquePerKey: false})
            bar(id ?: number) {
                return ++Foo.counter;
            }
        }

        const foo = new Foo;
        let cache, cache2;


        cache = foo.bar(1);
        cache2 = foo.bar(2);

        // First should be 1
        expect(cache).equal(1);

        // second is another cache, yet still give back 2
        expect(cache2).equal(1);
    });

    it('cacheNoUniqueKey', function () {
        class Foo {
            static counter = 0;

            @Cached({uniquePerKey: true})
            bar(id ?: number) {
                return ++Foo.counter;
            }
        }

        const foo = new Foo;
        const foo2 = new Foo;
        let cache, cache2;
        let cache3, cache4;


        cache = foo.bar(1);
        cache2 = foo.bar(1);

        cache3 = foo2.bar(1);
        cache4 = foo2.bar(2);

        // First should be 1
        expect(cache).equal(1);

        // second is another cache, yet still give back 2
        expect(cache2).equal(1);

        
        expect(cache3).equal(2);
        expect(cache4).equal(3);
    });
});