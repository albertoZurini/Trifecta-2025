# Commands to execute

`build.sh`

## For `run.sh`

- `nargo check`, only at the beginning to generate `Prover.toml`
- `nargo execute`
- `bb prove -b ./target/noir_proj.json -w ./target/noir_proj.gz -o ./target`, to generate the proof
- `bb write_vk -b ./target/noir_proj.json -o ./target`, to generate the verification key
- `bb verify -k ./target/vk -p ./target/proof`, to verify the proof
