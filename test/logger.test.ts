import {expect} from 'chai';
let ran2 = 0;
const old = console.count;
console.count = () => ++ran2; // override default count
import {Logger} from "../src"; // loads with this define function
console.count = old; // put it back

describe('logger', function () {

    it('logger', function () {
        let ran = 0;


        class Foo extends Object{
            @Logger(() => ++ran)
            bar() {
                return 5;
            }

            @Logger() // Uses console.count which we overriden
            baz() {

            }
        }

        let catched = false;
        const foo = new Foo;

        foo.bar();
        expect(ran).equal(1);
        foo.bar();
        expect(ran).equal(2);
        expect(ran).equal(2);
        foo.bar();
        expect(ran).equal(3);

        foo.baz();
        expect(ran2).equal(1);
        foo.baz();
        expect(ran2).equal(2);
        expect(ran2).equal(2);
        foo.baz();
        expect(ran2).equal(3);
    });

});