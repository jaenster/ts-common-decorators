import {Observe} from "../bin";
import {expect} from 'chai';

describe('observer',function() {
    it('should callback', function () {

        let myField = 1, passed = 0;
        function cb(v) {
            passed++;
            myField += v;
        }

        class Foo {
            @Observe(cb)
            public field = 0;

            @Observe(Foo.prototype.bar)
            public field2 : number = 0;

            // internal handler
            bar(value: number) {
                if (value % 2) {
                    this.passed++
                } else {
                    this.passed--;
                }
            }

            public passed = 0;

        }

        const foo = new Foo();
        foo.field++;

        foo.field2 = 1;
        foo.field2 = 2;
        foo.field2 = 3;
        foo.field2 = 4;
        foo.field2 = 6;


        expect(myField).equal(2);
        expect(foo.passed).equal(-1);
        foo.field2++;
        expect(foo.passed).equal(0);
    });
});