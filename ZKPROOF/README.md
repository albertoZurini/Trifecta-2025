# How to generate and verify the proof

- On the frontend, export the workflow
- Paste the content of the clipboard into `graph.json`
- Run `node compiler.js`, to generate the Noir source code
- Run `1_check.sh`, to generate the `Prover.toml` file
- Fill the file with the correct data
- Run `2_execute.sh`, to generate and verify the proof

# Commands to execute

`build.sh`

## For `run.sh`

- `nargo check`, only at the beginning to generate `Prover.toml`
- `nargo execute`
- `bb prove -b ./target/noir_proj.json -w ./target/noir_proj.gz -o ./target`, to generate the proof
- `bb write_vk -b ./target/noir_proj.json -o ./target`, to generate the verification key
- `bb verify -k ./target/vk -p ./target/proof`, to verify the proof
