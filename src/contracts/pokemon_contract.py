from pyteal import *


class Card:
    class Variables:
        name = Bytes("NAME")
        image = Bytes("IMAGE")
        owner = Bytes("OWNER")
        attributes = Bytes("ATTRIBUTES")
        price = Bytes("PRICE")
        isForsale = Bytes("isForsale")
        sold = Bytes("SOLD")

    class AppMethods:
        buy = Bytes("buy")
        sell = Bytes("sell")
        # transferownership = Bytes("transferownership")
        togglesale = Bytes("togglesale")

    # Creating a new pokemon card

    def application_creation(self):
        return Seq([
            Assert(
                And(
                    Txn.application_args.length() == Int(4),
                    Txn.note() == Bytes("pokemon:uv1"),
                    Len(Txn.application_args[0]) > Int(0),
                    Len(Txn.application_args[1]) > Int(0),
                    Len(Txn.application_args[2]) > Int(0),
                    Btoi(Txn.application_args[3]) > Int(0),
                )
            ),

            # Store the transaction arguments into the applications's global's state
            App.globalPut(self.Variables.name, Txn.application_args[0]),
            App.globalPut(self.Variables.image, Txn.application_args[1]),
            App.globalPut(self.Variables.attributes, Txn.application_args[2]),
            App.globalPut(self.Variables.price, Btoi(Txn.application_args[3])),
            App.globalPut(self.Variables.isForsale, Int(1)),
            App.globalPut(self.Variables.owner, Txn.sender()),
            Approve(),
        ])

  # others users can buy a pokemon card
    def buy(self):
        valid_number_of_transactions = Global.group_size() == Int(2)
        owner = App.globalGet(self.Variables.owner)
        valid_payment_to_seller = And(
            Gtxn[1].type_enum() == TxnType.Payment,
            Gtxn[1].receiver() == owner,
            Gtxn[1].amount() == App.globalGet(self.Variables.price),
            Gtxn[1].sender() == Gtxn[0].sender(),
            Gtxn[1].sender() != owner
        )

        can_buy = And(App.globalGet(self.Variables.isForsale) == Int(1),
                      valid_number_of_transactions,
                      valid_payment_to_seller)

        update_state = Seq([
            App.globalPut(self.Variables.owner, Txn.sender()),
            App.globalPut(self.Variables.isForsale, Int(0)),
            App.globalPut(self.Variables.sold, Int(1)),
            Approve()
        ])

        return If(can_buy).Then(update_state).Else(Reject())

    # transferring of ownership
    # def transferownership(self):
    #     Assert(
    #         And(
    #                 Txn.sender() == App.globalGet(self.Variables.owner),
    #                 Txn.application_args.length() == Int(2),
    #                 Len(Txn.application_args[1]) == Int(58)
    #         ),
    #     ),
    #     return Seq([
    #         App.globalPut(self.Variables.owner, Txn.application_args[1]),
    #         If(App.globalGet(self.Variables.isForsale) == Int(1)).Then(App.globalPut(self.Variables.isForsale, Int(0))),
    #         Approve()
    #     ])

    def sell(self):
        Assert(
            And(
                Txn.application_args.length() == Int(1),
                Txn.sender() == App.globalGet(self.Variables.owner),
                App.globalGet(self.Variables.isForsale) == Int(1),
            ),
        )

        return Seq([
            App.globalPut(self.Variables.sold, Int(0)),
            Approve()
        ])

    # toggling the forsale property
    def toggleSale(self):
        Assert(
            And(
                Txn.application_args.length() == Int(1),
                Txn.sender() == App.globalGet(self.Variables.owner),
                App.globalGet(self.Variables.isForsale) == Int(1),
            ),
        )

        setForSale = Seq([
            App.globalPut(self.Variables.isForsale, Int(1)),
            Approve()
        ])

        setNotForSale = Seq([
            App.globalPut(self.Variables.isForsale, Int(0)),
            Approve()
        ])

        return Seq([
            If(App.globalGet(self.Variables.isForsale) == Int(0)).Then(
                setForSale).Else(setNotForSale),
            Approve()
        ])

    # delete a pokemon card .

    def application_deletion(self):
        return Return(Txn.sender() == Global.creator_address())

    # Check transaction conditions
    def application_start(self):
        return Cond(
            [Txn.application_id() == Int(0), self.application_creation()],
            # If the the OnComplete action of the transaction is DeleteApplication, the application_deletion() method is called
            [Txn.on_completion() == OnComplete.DeleteApplication,
             self.application_deletion()],
            # if the first argument of the transaction matches the AppMethods.buy value, the buy() method is called.
            [Txn.application_args[0] == self.AppMethods.buy, self.buy()],
            # if the first argument of the transaction matches the AppMethods.sell value, the sell() method is called.

            [Txn.application_args[0] == self.AppMethods.sell, self.sell()],

            [Txn.application_args[0] == self.AppMethods.togglesale, self.toggleSale()],
        )

    # The approval program is responsible for processing all application calls to the contract.
    def approval_program(self):
        return self.application_start()

    # The clear program is used to handle accounts using the clear call to remove the smart contract from their balance record.
    def clear_program(self):
        return Return(Int(1))
