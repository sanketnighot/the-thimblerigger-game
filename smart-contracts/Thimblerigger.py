import smartpy as sp
import utilities.address as Address
from utilities.fa2_minimal_nft import main


@sp.module
def thimblerigger():

    class Thimblerigger(main.Fa2NftMinimal):

        def __init__(self, metadata, administrator, hux_contract_address):
            main.Fa2NftMinimal.__init__(
                self,
                administrator,
                metadata,
            )
            self.data.hux_contract_address = sp.cast(hux_contract_address, sp.address)
            self.data.burn_address = sp.cast(
                sp.address("tz1burnburnburnburnburnburnburjAYjjX"), sp.address
            )
            self.data.max_mint = sp.cast(100, sp.nat)
            self.data.success_nft_base_url = sp.cast(
                "https://success_example.com/", sp.string
            )
            self.data.failure_nft_base_url = sp.cast(
                "https://failure_example.com/", sp.string
            )
            self.data.last_success_id = sp.cast(0, sp.nat)
            self.data.last_failure_id = sp.cast(0, sp.nat)
            self.data.distribution = sp.cast(
                (sp.nat(34), sp.nat(66)), sp.pair[sp.nat, sp.nat]
            )
            self.data.game_price = sp.cast(sp.tez(3), sp.mutez)

        @sp.entrypoint
        def mint(self):
            assert sp.balance == self.data.game_price, "InvalidAmount"
            token_id = self.data.next_token_id
            metadata = self.data.success_nft_base_url
            self.data.token_metadata[token_id] = sp.record(
                token_id=token_id,
                token_info=sp.pack(metadata),
            )
            self.data.ledger[token_id] = sp.sender
            self.data.next_token_id += 1


if __name__ == "__main__":

    @sp.add_test()
    def test():
        sc = sp.test_scenario(
            "Thimblerigger", [sp.math, sp.string_utils, main, thimblerigger]
        )
        sc.h1("Thimblerigger Contract")

        sc.h2("Originate Thimblerigger Contract")
        thbr = thimblerigger.Thimblerigger(
            metadata=sp.scenario_utils.metadata_of_url("https://example.com"),
            administrator=Address.admin,
            hux_contract_address=sp.address("KT1HuxAddress"),
        )
        sc += thbr

        sc.h1("--------- Storage ---------")
        sc.show(thbr.data)
