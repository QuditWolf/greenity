import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { SimpleCounter } from '../wrappers/SimpleCounter';
import '@ton/test-utils';

describe('GreenityBlamer', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let simpleCounter: SandboxContract<SimpleCounter>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        simpleCounter = blockchain.openContract(await SimpleCounter.fromInit(0n));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await simpleCounter.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: simpleCounter.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and simpleCounter are ready to use
    });

    it('greenity checker', async () => {
        const greenityBefore = await simpleCounter.getGreenity();
	console.log(`greenity score before blame ${greenityBefore}`);
            
	const greenityBlame = BigInt(Math.floor(Math.random() * 100));

            const increaseResult = await simpleCounter.send(
                deployer.getSender(),
                {
                    value: toNano('0.05'),
                },
                {
                    $$type: 'Add',
                    queryId: 0n,
                    amount: greenityBlame,
                }
            );

            expect(increaseResult.transactions).toHaveTransaction({
                from: deployer.address,
                to: simpleCounter.address,
                success: true,
            });

            const greenityAfter = await simpleCounter.getGreenity();

            console.log('greenity scorer after increasing', greenityAfter);

            expect(greenityAfter).toBe(greenityBefore + greenityBlame);
        
    });
});
