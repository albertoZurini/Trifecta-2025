docker run -v $PWD:/zkproof --rm -t zkp:latest \
/bin/bash -c "cd /zkproof/noir_proj && \
echo Executing Nargo && \
nargo execute && \
echo Generating proof && \
bb prove -b ./target/noir_proj.json -w ./target/noir_proj.gz -o ./target && \
echo Writing verification key && \
bb write_vk -b ./target/noir_proj.json -o ./target && \
echo Verifying proof && \
bb verify -k ./target/vk -p ./target/proof"