import {MetaData, Static} from '../bin';
import {expect} from 'chai';

describe('metadata', function () {

    it('onMethod', function () {

        class Foo {
            @MetaData({test: 'lol'})
            bar() {
                return 5;
            }
        }

        const foo = new Foo();

        expect(MetaData.get(foo.bar).test).equal('lol');
        expect(foo.bar()).equal(5);
    });


    it('onMethodEmpty', function () {

        class Foo {
            @MetaData({})
            bar() {
                return 5;
            }

            @MetaData()
            baz() {
                return 5;
            }
        }

        const foo = new Foo();
        const data = MetaData.get(foo.bar).key;

        expect(Object.keys(MetaData.get(foo.bar)).length).equal(0);
        expect(Object.keys(MetaData.get(foo.baz)).length).equal(0);
        expect(foo.bar()).equal(5);
        expect(foo.baz()).equal(5);
    });

    it('onMethodComputed', function () {

        const metaObj = {key2: 'test'};
        let i = 0;
        Object.defineProperty(metaObj, 'key', {
            get(): any {
                return ++i;
            }
        });
        Object.defineProperty(metaObj, 'key3', {
            get(): any {
                return ++i;
            },
            enumerable: true
        });

        class Foo {
            @MetaData(metaObj)
            bar() {
                return 5;
            }

            @MetaData(metaObj)
            baz() {
                return 5;
            }
        }

        const foo = new Foo();

        // computed variables dont come with @ metadata
        expect(MetaData.get(foo.bar).key).equal(undefined);

        expect(MetaData.get(foo.baz).key2).equal('test');

        // computed values do come if they are enumerable
        expect(MetaData.get(foo.bar).key3).equal(1);

        // But, they are written once, they are not read again the second time
        expect(MetaData.get(foo.bar).key3).equal(1);
        expect(foo.bar()).equal(5);
        expect(foo.baz()).equal(5);
    });
});