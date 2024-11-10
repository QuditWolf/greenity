import "@stdlib/deploy";

message Add {
    queryId: Int as uint64;
    amount: Int as uint32;
}

contract SimpleCounter with Deployable {
    id: Int as uint32;
    counter: Int as uint32;
    greenity: Int as uint32;

    init(id: Int) {
        self.id = id;
        self.counter = 0;
	self.greenity = 74;
    }

    receive(msg: Add) {
        self.counter += msg.amount;
        self.greenity += msg.amount*BigInt(Math.floor(Math.random() * 10));

        // Notify the caller that the receiver was executed and forward remaining value back
        self.notify("Cashback".asComment());
    }

    get fun counter(): Int {
        return self.counter;
    }

    get fun id(): Int {
        return self.id;
    }

    get fun greenity(): Int {
        return self.greenity;
    }
}
