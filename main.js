const SHA256 = require('crypto-js/sha256');

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amout = amount;
    }

}

class Block {
    /*
    index- optional param tells position of block on the chain
    timestamp - holds the date of creation of the block
    data - details of the transaction
    previousHash - string of the previous block hash
     */
    constructor(timestamp, data, previousHash = 0) {
        this.timestamp = timestamp;
        this.transactions = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    /*
    Uses the imported SHA256 func.
     */
    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        // trick
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();

        }

        console.log("Block mined: " + this.hash);
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.diffiuclty = 2;
        this.pendingTranscation = [];
        this.miningReward = 100;
    }

    createGenesisBlock() {
        return new Block("27/02/2017", "Genesis", "-1");
    }

    //returns the last element on the chain
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    //adds new block on the chain
    /*
    addBlock(newBlock) {
        //sets the previous hash of the new block to the last block on the chain
        newBlock.previousHash = this.getLatestBlock().hash;
        //recalculate its hash - every time a block property gets changed, we must rehash the block
        //newBlock.hash = newBlock.calculateHash();
        newBlock.mineBlock(this.diffiuclty)
        this.chain.push(newBlock);
    }
     */
    minePendingTransactions(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTranscation);
        block.mineBlock(this.diffiuclty);

        console.log('block was mined successfuly');
        this.chain.push(block);

        //reset pending transcation & create new transaction for miner rewards
        this.pendingTranscation = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    createTransaction(transaction) {
        this.pendingTranscation.push(transaction);
    }

    getBalanceOfAddress(address) {
        let balance = 0;
        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.fromAddress === address) {
                    balance -= trans.amount;
                }
                if (trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }
        return balance;
        console.log(balance);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            //is the hash of the current block not equal to current hash
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

let smolyCoin = new Blockchain();
smolyCoin.createTransaction(new Transaction('addr1', 'addr2', 100));
smolyCoin.createTransaction(new Transaction('addr2', 'addr1', 50));

console.log('mine');
smolyCoin.minePendingTransactions('fake-address');

console.log('balance: ' + smolyCoin.getBalanceOfAddress('fake-address'));

console.log('mine');
smolyCoin.minePendingTransactions('fake-address');

console.log('balance: ' + smolyCoin.getBalanceOfAddress('fake-address'));