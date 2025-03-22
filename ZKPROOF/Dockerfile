FROM ubuntu:24.04

WORKDIR /build
RUN apt-get update
RUN apt-get install -y wget curl git jq
RUN curl -L https://raw.githubusercontent.com/noir-lang/noirup/refs/heads/main/install | bash
ENV NARGO_HOME="/root/.nargo"
ENV PATH="$PATH:$NARGO_HOME/bin"
RUN noirup
RUN curl -L https://raw.githubusercontent.com/AztecProtocol/aztec-packages/refs/heads/master/barretenberg/bbup/install | bash
ENV BB_HOME="/root/.bb"
ENV PATH="$PATH:$BB_HOME"
RUN bbup

WORKDIR /zkproof