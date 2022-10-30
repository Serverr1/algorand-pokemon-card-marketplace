from pyteal import *


class Card:
    class Variables:
        name = Bytes("NAME")
        image = Bytes("IMAGE")
        attributes = Bytes("ATTRIBUTES") 
        price = Bytes("PRICE")
        isforsale = Bytes("ISFORSALE")
        

    class AppMethods:
        buy = Bytes("buy")
        transferownership = Bytes("transferownership")
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
            App.globalPut(self.Variables.isforsale, Int(1)),

            Approve(),
        ])

    def buy(self):
            valid_number_of_transactions = Global.group_size() == Int(2)

            valid_payment_to_seller = And(
                Gtxn[1].type_enum() == TxnType.Payment,
                Gtxn[1].receiver() == Global.creator_address(),
                Gtxn[1].amount() == App.globalGet(self.Variables.price),
                Gtxn[1].sender() == Gtxn[0].sender(),
            )

            can_buy = And(valid_number_of_transactions,
                        valid_payment_to_seller)

            update_state = Seq([
                Global.creator_address == Txn.sender(),
                Approve()
            ])

            return If(can_buy).Then(update_state).Else(Reject())

    

    # transferring of ownership
    def transferownership(self):
        Assert(
            And(
                    Global.group_size() == Int(1),
                    Txn.sender() == Global.creator_address(),
                    Txn.applications.length() == Int(1),
                    Txn.application_args.length() == Int(2),
            ),
        ),
        return Seq([
            App.globalPut(Global.creator_address, Txn.application_args[2]),
            Approve()
        ])


    # toggling the forsale property
    def togglesale(self):
        Assert(
            And(
                Txn.application_args.length() == Int(1),
                Txn.sender() == Global.creator_address(),
                App.globalGet(self.Variables.forsale) == Int(1),
            ),
        )

        set_forsale = Seq([
                App.globalPut(self.Variables.isforsale, Int(1)),
                Approve()
            ])


        set_notforsale = Seq([
                App.globalPut(self.Variables.isforsale, Int(0)),
                Approve()
            ])


        return Seq([
           If(self.Variables.isforsale == 0).Then(set_forsale).Else(set_notforsale),
            Approve()
        ])


    # To delete a picture.
    def application_deletion(self):
        return Return(Txn.sender() == Global.creator_address())

    # Check transaction conditions
    def application_start(self):
        return Cond(
            # checks if the application_id field of a transaction matches 0.
            # If this is the case, the application does not exist yet, and the application_creation() method is called
            [Txn.application_id() == Int(0), self.application_creation()],
            # If the the OnComplete action of the transaction is DeleteApplication, the application_deletion() method is called
            [Txn.on_completion() == OnComplete.DeleteApplication,
             self.application_deletion()],
            # if the first argument of the transaction matches the AppMethods.buy value, the buy() method is called.
            
            [Txn.application_args[0] == self.AppMethods.buy, self.buy()],
            [Txn.application_args[0] == self.AppMethods.transferownership, self.transferownership()],
            [Txn.application_args[0] == self.AppMethods.togglesale, self.togglesale()],
        )

    # The approval program is responsible for processing all application calls to the contract.
    def approval_program(self):
        return self.application_start()

    # The clear program is used to handle accounts using the clear call to remove the smart contract from their balance record.
    def clear_program(self):
        return Return(Int(1))