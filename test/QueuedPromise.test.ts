import {QueuedPromise} from '../bin';
import {expect} from 'chai';

describe('queuedPromise', function () {

    it('general test', async function () {

        let delay = 30;

        let i = 0;

        class Foo {
            @QueuedPromise()
            bar(): Promise<any> {
                let v = (i++);
                // console.log('bar is executed #' + v);
                return new Promise(resolve => {
                    setTimeout(() => {
                        // console.log('bar is resolved #' + v);
                        resolve()
                    }, delay)
                }); // solve after small delay
            }

            async assignTask(task: string): Promise<any> {

            }

            baz(): Promise<any> {
                let v = (i++);
                // console.log('baz is executed #' + v);
                return new Promise(resolve => {
                    setTimeout(() => {
                        // console.log('baz is resolved #' + v);
                        resolve()
                    }, delay)
                }); // solve after small delay
            }
        }

        let startTimeQue = (new Date).getTime();
        const foo = new Foo();

        // wrap test in promise, so chai waits for expect to be called
        await new Promise(resolve => {
            [1, 2, 3, 4, 5].map((e, i) => foo.bar())[4].then(() => {

                // If queueing worked correctly, it took atleast 4 times the delay.
                // If queuing didnt work, it did it async, so the delay would be 1x the delay
                expect((new Date).getTime() - startTimeQue).greaterThan(delay * 4);

                // let chai know we are done testing
                resolve();
            })
        });

        i = 0;
        // reset the timer =)
        startTimeQue = (new Date).getTime();
        return new Promise(resolve => {
            [1, 2, 3, 4, 5].map((e, i) => foo.baz())[4].then(() => {

                // now we dont queue, we expect to be run less as 1x (and a bit) of the delay, as its async
                expect((new Date).getTime() - startTimeQue).lessThan(delay * 4);

                // let chai know we are done testing
                resolve();
            })
        });


    });

});