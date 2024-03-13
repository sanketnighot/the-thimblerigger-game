import smartpy as sp  # type: ignore

thimblerigger_contract = sp.io.import_script_from_url(
    "file:./contracts/Thimblerigger.py"
)

# Initializing the tests for the nft_contract
if __name__ == "__main__":

    @sp.add_test(name="ThimbleriggerTest")
    def test():
        # Initializing the test scenario
        sc = sp.test_scenario()

        admin = sp.test_account("admin")
        alice = sp.test_account("alice")
        bob = sp.test_account("bob")
        elon = sp.test_account("elon")
        mark = sp.test_account("mark")
        fund_manager = sp.test_account("fund_manager")

        sc.h1("NFT Contract")
        sc.table_of_contents()
        sc.h2("Accounts")
        sc.show([admin, alice, bob, elon, mark, fund_manager])

        # Create NFT Contract instance
        sc.h2("NFT Contract Origination")
        thblr = thimblerigger_contract.Thimblerigger(
            administrator=sp.address("tz1Admin"),
            metadata=sp.utils.metadata_of_url(
                "ipfs://QmUqKqyVMJhF8U6K7oykiCLezK15z3heqWWPdi3vHLGxaa"
            ),
            hux_token_address=sp.address("KT1HuxFa2FungibleTokenAddress"),
            max_mint=sp.nat(100),
            price_of_mint=sp.tez(3),
            hux_amount=sp.nat(10000000),
            reward_amount=sp.tez(9),
        )

        sc += thblr

        sc += thblr.default().run(sender=admin, amount=sp.tez(30))

        sc += thblr.play_game(
            sp.pack(
                sp.record(
                    result=sp.nat(0),
                    metadata=sp.map(
                        {
                            "": sp.utils.bytes_of_string(
                                "ipfs://QmcJ3iPjpF4R1gnmexQWvxA4PJemRH7mgWUu4v9tYkZXh2"
                            )
                        }
                    ),
                )
            )
        ).run(
            amount=sp.tez(3),
            sender=alice,
        )

        sc += thblr.play_game(
            sp.pack(
                sp.record(
                    result=sp.nat(1),
                    metadata=sp.map(
                        {
                            "": sp.utils.bytes_of_string(
                                "ipfs://QmcJ3iPjpF4R1gnmexQWvxA4PJemRH7mgWUu4v9tYkZXh2"
                            )
                        }
                    ),
                )
            )
        ).run(
            amount=sp.tez(3),
            sender=alice,
        )

        sc += thblr.redeem(0).run(
            sender=bob,
            valid=False,
        )

        sc += thblr.redeem(0).run(
            sender=alice,
        )

        sc += thblr.redeem(1).run(
            sender=alice,
            valid=False,
        )
