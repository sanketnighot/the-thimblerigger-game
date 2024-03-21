import smartpy as sp
import utilities.address as Address
from utilities.fa2_minimal_nft import main


@sp.module
def thimblerigger():
    transfer_params_type: type = sp.list[
        sp.record(
            from_=sp.address,
            txs=sp.list[
                sp.record(to_=sp.address, amount=sp.nat, token_id=sp.nat).layout(
                    ("to_", ("token_id", "amount"))
                )
            ],
        ).layout(("from_", "txs")),
    ]

    game_ledger_value_type: type = sp.record(
        player=sp.address,
        result_id=sp.nat,
        result=sp.nat,
        redeemed=sp.bool,
    )

    class Thimblerigger(main.Fa2NftMinimal):
        """
        Thimblerigger contract.
        """

        def __init__(
            self,
            metadata,
            administrator,
            hux_contract_address,
            hux_amount,
            game_price,
            game_reward,
        ):
            """
            Initialize the Thimblerigger contract.

            :param metadata: The metadata for the contract.
            :param administrator: The address of the contract administrator.
            :param hux_contract_address: The address of the HUX token contract.
            :param hux_amount: The amount of HUX tokens to transfer in each game.
            :param game_price: The price of playing the game in tez.
            :param game_reward: The reward amount in tez for winning the game.
            """
            main.Fa2NftMinimal.__init__(
                self,
                administrator,
                metadata,
            )
            self.data.hux_contract_address = sp.cast(hux_contract_address, sp.address)
            self.data.burn_address = sp.cast(
                sp.address("tz1burnburnburnburnburnburnburjAYjjX"), sp.address
            )
            self.data.max_mint = sp.cast(30, sp.nat)
            self.data.success_nft_base_url = sp.cast(
                "ipfs://QmciLugiC4KbbH532q5cLPWbM5wCGSefY5E5DDkYs6hgsw/success/",
                sp.string,
            )
            self.data.failure_nft_base_url = sp.cast(
                "ipfs://QmciLugiC4KbbH532q5cLPWbM5wCGSefY5E5DDkYs6hgsw/failure/",
                sp.string,
            )
            self.data.last_success_id = sp.cast(0, sp.nat)
            self.data.last_failure_id = sp.cast(0, sp.nat)
            self.data.distribution = sp.cast(
                (sp.nat(10), sp.nat(20)), sp.pair[sp.nat, sp.nat]
            )
            self.data.game_price = sp.cast(game_price, sp.mutez)
            self.data.game_reward = sp.cast(game_reward, sp.mutez)
            self.data.hux_amount = sp.cast(hux_amount, sp.nat)
            self.data.game_ledger = sp.cast(
                sp.big_map(), sp.big_map[sp.nat, game_ledger_value_type]
            )
            self.data.pause = sp.cast(False, sp.bool)

        @sp.private(with_operations=True)
        def transferToken(self, params):
            """
            Transfer tokens from the contract to a receiver.

            :param params: The transfer parameters.
            """
            sp.cast(
                params,
                sp.record(
                    sender=sp.address,
                    receiver=sp.address,
                    amount=sp.nat,
                    token_id=sp.nat,
                    token_contract=sp.address,
                ),
            )
            contractParams = sp.contract(
                transfer_params_type,
                params.token_contract,
                "transfer",
            ).unwrap_some()

            dataToBeSent = sp.cast(
                [
                    sp.record(
                        from_=params.sender,
                        txs=[
                            sp.record(
                                to_=params.receiver,
                                amount=params.amount,
                                token_id=params.token_id,
                            )
                        ],
                    )
                ],
                transfer_params_type,
            )

            sp.transfer(dataToBeSent, sp.mutez(0), contractParams)

        @sp.private(with_storage="read-write")
        def is_admin(self):
            """
            Check if the sender is the contract administrator.
            """
            assert sp.sender == self.data.administrator, "NotAdmin"

        @sp.private(with_storage="read-write")
        def is_paused(self):
            """
            Check if the contract is paused.
            """
            assert self.data.pause == False, "ContractPaused"

        @sp.entrypoint
        def default(self):
            """
            Default entrypoint.
            """
            self.is_paused()
            pass

        @sp.entrypoint
        def play(self):
            """
            Play the Thimblerigger game.
            """
            # Check if the sender has enough balance to play the game
            self.is_paused()
            assert sp.amount == self.data.game_price, "InsufficientAmount"
            assert self.data.next_token_id < self.data.max_mint, "MaxMintReached"
            assert sp.balance >= sp.tez(9), "InsufficientBalance"

            # Generate Sudo Random Number
            token_id = self.data.next_token_id
            current_time_in_nat = utils.seconds_of_timestamp(  # type: ignore
                sp.add_days(sp.now, sp.to_int(self.data.next_token_id + sp.nat(17623)))
            )
            current_level = sp.level

            sudo_random_number = sp.mod(
                (current_time_in_nat * current_level) + self.data.next_token_id,
                sp.nat(2),
            )

            (total_success, total_failure) = self.data.distribution

            # Create Metadata According to Result
            metadata_url = ""
            if sudo_random_number == sp.nat(1):
                if (self.data.last_failure_id) < total_failure:
                    metadata_url = sp.concat(
                        [
                            self.data.failure_nft_base_url,
                            string_utils.from_digit(sp.to_int(self.data.last_failure_id)),  # type: ignore
                            ".json",
                        ]
                    )
                    self.data.token_metadata[token_id] = sp.record(
                        token_id=token_id,
                        token_info={"": sp.pack(metadata_url)},
                    )
                    # Record the game result
                    self.data.game_ledger[token_id] = sp.record(
                        player=sp.sender,
                        result_id=self.data.last_failure_id,
                        result=sudo_random_number,
                        redeemed=False,
                    )
                    self.data.last_failure_id += 1

                else:
                    sudo_random_number = sp.nat(0)
                    metadata_url = sp.concat(
                        [
                            self.data.success_nft_base_url,
                            string_utils.from_digit(sp.to_int(self.data.last_success_id)),  # type: ignore
                            ".json",
                        ]
                    )
                    self.data.token_metadata[token_id] = sp.record(
                        token_id=token_id,
                        token_info={"": sp.pack(metadata_url)},
                    )
                    # Record the game result
                    self.data.game_ledger[token_id] = sp.record(
                        player=sp.sender,
                        result_id=self.data.last_success_id,
                        result=sudo_random_number,
                        redeemed=False,
                    )
                    self.data.last_success_id += 1

            else:
                if sudo_random_number == sp.nat(0):
                    if (self.data.last_success_id) < total_success:
                        metadata_url = sp.concat(
                            [
                                self.data.success_nft_base_url,
                                string_utils.from_digit(sp.to_int(self.data.last_success_id)),  # type: ignore
                                ".json",
                            ]
                        )
                        self.data.token_metadata[token_id] = sp.record(
                            token_id=token_id,
                            token_info={"": sp.pack(metadata_url)},
                        )
                        # Record the game result
                        self.data.game_ledger[token_id] = sp.record(
                            player=sp.sender,
                            result_id=self.data.last_success_id,
                            result=sudo_random_number,
                            redeemed=False,
                        )
                        self.data.last_success_id += 1

                    else:
                        sudo_random_number = sp.nat(1)
                        metadata_url = sp.concat(
                            [
                                self.data.failure_nft_base_url,
                                string_utils.from_digit(sp.to_int(self.data.last_failure_id)),  # type: ignore
                                ".json",
                            ]
                        )
                        self.data.token_metadata[token_id] = sp.record(
                            token_id=token_id,
                            token_info={"": sp.pack(metadata_url)},
                        )
                        # Record the game result
                        self.data.game_ledger[token_id] = sp.record(
                            player=sp.sender,
                            result_id=self.data.last_failure_id,
                            result=sudo_random_number,
                            redeemed=False,
                        )
                        self.data.last_failure_id += 1

            # Mint the NFT
            self.data.token_metadata[token_id] = sp.record(
                token_id=token_id,
                token_info={"": sp.pack(metadata_url)},
            )
            self.data.ledger[token_id] = sp.sender
            sp.trace(metadata_url)
            sp.emit(
                sp.record(
                    game_id=token_id, player=sp.sender, result=sudo_random_number
                ),
                tag="GamePlayed",
            )
            self.data.next_token_id += 1

        @sp.entrypoint
        def redeem(self, token_ids):
            """
            Redeem the NFT tokens.

            :param token_ids: The list of token IDs to redeem.
            """
            sp.cast(token_ids, sp.list[sp.nat])
            assert len(token_ids) > 0, "InvalidTokenIds"
            assert sp.balance >= sp.tez(9), "InsufficientBalance"
            self.is_paused()
            for token_id in token_ids:
                game_info = self.data.game_ledger[token_id]
                assert game_info.player == sp.sender, "InvalidSender"
                assert game_info.result == sp.nat(0), "InvalidResult"
                assert game_info.redeemed == False, "AlreadyRedeemed"
                self.transferToken(
                    sp.record(
                        sender=sp.sender,
                        receiver=self.data.burn_address,
                        amount=sp.nat(1),
                        token_id=token_id,
                        token_contract=sp.self_address(),
                    )
                )
                sp.send(sp.sender, self.data.game_reward)
                self.data.game_ledger[token_id].redeemed = True
            sp.emit(
                sp.record(game_id=token_ids, player=sp.sender),
                tag="RewardRedeemed",
            )

        @sp.entrypoint
        def withdraw_tez(self, amount):
            """
            Withdraw tez from the contract.

            :param amount: The amount of tez to withdraw.
            """
            self.is_admin()
            assert sp.balance >= amount, "InsufficientBalance"
            sp.send(self.data.administrator, amount)
            sp.emit(sp.record(amount=amount), tag="TezWithdrawn")

        @sp.entrypoint
        def withdraw_hux(self, amount):
            """
            Withdraw HUX tokens from the contract.

            :param amount: The amount of HUX tokens to withdraw.
            """
            self.is_admin()
            self.transferToken(
                sp.record(
                    sender=sp.self_address(),
                    receiver=self.data.administrator,
                    amount=amount,
                    token_id=sp.nat(0),
                    token_contract=self.data.hux_contract_address,
                )
            )
            sp.emit(sp.record(amount=amount), tag="HuxWithdrawn")

        @sp.entrypoint
        def toggle_pause(self, action):
            sp.cast(action, sp.bool)
            self.is_admin()
            self.data.pause = action
            sp.emit(sp.record(action=action), tag="PauseToggled")


if __name__ == "__main__":

    @sp.add_test()
    def test():
        sc = sp.test_scenario(
            "Thimblerigger",
            [sp.math, sp.rational, sp.string_utils, sp.utils, main, thimblerigger],
        )
        sc.h1("Thimblerigger Contract")

        sc.h2("Originate Thimblerigger Contract")
        thbr = thimblerigger.Thimblerigger(
            metadata=sp.scenario_utils.metadata_of_url("https://example.com"),
            administrator=Address.admin,
            hux_contract_address=sp.address("KT1HuxAddress"),
            hux_amount=sp.nat(100000),
            game_price=sp.tez(3),
            game_reward=sp.tez(9),
        )
        sc += thbr

        sc.h1("--------- Storage ---------")
        sc.show(thbr.data)

        sc.h1("--------- Mint ---------")
        thbr.play(
            _sender=Address.admin,
            _amount=sp.tez(3),
            _now=sp.timestamp(12211),
            _level=sp.nat(3),
        )
        thbr.play(
            _sender=Address.alice,
            _amount=sp.tez(3),
            _now=sp.timestamp(122119),
            _level=sp.nat(38),
        )
        thbr.play(
            _sender=Address.alice,
            _amount=sp.tez(3),
            _now=sp.timestamp(122191),
            _level=sp.nat(83),
        )
        thbr.play(
            _sender=Address.alice,
            _amount=sp.tez(3),
            _now=sp.timestamp(122161),
            _level=sp.nat(93),
        )
        thbr.play(
            _sender=Address.bob,
            _amount=sp.tez(3),
            _now=sp.timestamp(122121),
            _level=sp.nat(32),
        )
        thbr.play(
            _sender=Address.elon,
            _amount=sp.tez(3),
            _now=sp.timestamp(1221091),
            _level=sp.nat(321),
        )
        thbr.play(
            _sender=Address.alice,
            _amount=sp.tez(3),
            _now=sp.timestamp(122191),
            _level=sp.nat(83),
        )
        thbr.play(
            _sender=Address.alice,
            _amount=sp.tez(3),
            _now=sp.timestamp(122161),
            _level=sp.nat(93),
        )
        thbr.play(
            _sender=Address.bob,
            _amount=sp.tez(3),
            _now=sp.timestamp(122121),
            _level=sp.nat(32),
        )
        thbr.play(
            _sender=Address.elon,
            _amount=sp.tez(3),
            _now=sp.timestamp(1221091),
            _level=sp.nat(321),
        )

        sc.h1("--------- Redeem ---------")
        thbr.update_operators(
            [
                sp.variant.add_operator(
                    sp.record(
                        owner=Address.alice, operator=thbr.address, token_id=sp.nat(1)
                    )
                )
            ],
            _sender=Address.alice,
        )
        thbr.redeem(
            [1],
            _sender=Address.alice,
            _valid=False,
        )

        thbr.redeem(
            [1],
            _sender=Address.bob,
            _valid=False,
        )

        thbr.redeem(
            [1],
            _sender=Address.alice,
            _valid=False,
        )
        thbr.redeem(
            [],
            _sender=Address.alice,
            _valid=False,
        )

        sc.h1("--------- Storage ---------")
        sc.show(thbr.data.game_ledger)
        sc.show(thbr.balance)

    @sp.add_test()
    def test():
        sc = sp.test_scenario(
            "ThimbleriggerCompiled",
            [sp.math, sp.rational, sp.string_utils, sp.utils, main, thimblerigger],
        )
        metadata_dict = sp.create_tzip16_metadata(
            name="The Thimblerigger Test",
            version="1.0.0",
            license_name="None",
            description="An art project to show similarities between NFT and Scam methods. The project is an NFT mint page where I offer to redeem certain NFTs for double the price.",
            authors=["Max Haarich <https://x.com/UzupisMUC>"],
        )
        metadata_uri = sp.pin_on_ipfs(
            metadata_dict,
            "6de056e33b24623371f1",
            "8f8db8c40cc4edc8c10eb8e6ccc11337fe714d2755afff69353563aac4bfc816",
        )

        thbr = thimblerigger.Thimblerigger(
            metadata=sp.scenario_utils.metadata_of_url(metadata_uri),
            administrator=sp.address("tz1NXUXCPwsQMHGCpdz8d1HowSp7WjNRvWth"),
            hux_contract_address=sp.address("KT1MgzSQtKuzce3GQoo776K68EU7mpcPH8Fk"),
            hux_amount=sp.nat(100),
            game_price=sp.tez(3),
            game_reward=sp.tez(9),
        )
        sc += thbr
