import {PromiseOnce} from "../bin";
import {expect} from "chai";

describe('promiseOnce', function () {

    it('asyncawait', async function () {


        let ran = 0;

        class Foo {
            @PromiseOnce()
            async bar(id?: number) {
                ran++;
                return Symbol('Unique');
            }
        }

        const foo = new Foo();
        const [one, two, three, four] = await Promise.all([
            foo.bar(1),
            foo.bar(3),
            foo.bar(3), // Dupe
            foo.bar(7)
        ]);

        expect(ran).equal(3);

        // returns of the same async function, so its the same unique Symbol
        expect(two === three).equal(true);

        // two cant be one, its another unique Symbol
        expect(two === one).equal(false);

        // Four isnt one, so it ain't equal
        expect(four === one).equal(false);
    });

    it('complexTest', async function () {

        let resolverBar;

        class Foo {
            @PromiseOnce()
            bar(id?: number) {
                return new Promise((resolve, reject) => {
                    resolverBar = resolverBar || resolve;
                });
            }

        }

        const foo = new Foo();

        const promisers: Promise<any>[] = [foo.bar(), foo.bar(), foo.bar(3)];

        expect(
            promisers // Loop over all promises. Filter out those that are not the same as the first
                .filter((el, index, self) => el === self[0])
                .length // give back the length
        ).equal(2); // Should be 2, as they are all equal except the last


        // Now wait a little bit, until resolver is done resolving and call all the then promises
        await new Promise(resolve => {
            // when it processed the resolving, we can continue with the test
            promisers[0].then(() => resolve());

            // While this happens async, its not instant
            resolverBar('Resolved Status lol');
        });

        // Now PromiseOnce should know its resolved, so adding a similar one, should result in a new promise
        const test = foo.bar();
        const test2 = foo.bar();
        expect(test === promisers[0]).equal(false); // So the first instance isn't the same as the new one
        // yet it should be the same as the second
        expect(test === test2).equal(true);
    });
});