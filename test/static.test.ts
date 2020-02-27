import {Static} from '../src';
import {expect} from 'chai';

describe('static', function () {

    it('newOnStatic', function () {

        @Static class Foo extends Object{
            static bar() {
                return 5;
            }
        }

        let catched = false;
        try {
            const foo = new Foo;
        } catch(e) {
            catched = e.message === 'Cant call new on static';
        }

        expect(catched).equal(true);
        expect(Foo.bar()).equal(5);
    });

});