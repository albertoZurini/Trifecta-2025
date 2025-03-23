FROM rust:1.83.0-bookworm

WORKDIR /build
RUN apt-get update
RUN apt-get install -y wget curl git build-essential
RUN apt-get update && \
    apt-get install -y wget gnupg lsb-release && \
    echo "deb http://apt.llvm.org/$(lsb_release -cs)/ llvm-toolchain-$(lsb_release -cs)-16 main" | tee /etc/apt/sources.list.d/llvm.list && \
    wget -O - https://apt.llvm.org/llvm-snapshot.gpg.key | apt-key add - && \
    apt-get update && \
    apt-get install -y clang-16 llvm-16-dev lld-16 libclang-16-dev && \
    update-alternatives --install /usr/bin/clang clang /usr/bin/clang-16 100 && \
    update-alternatives --install /usr/bin/clang++ clang++ /usr/bin/clang++-16 100
RUN apt-get install -y llvm

#RUN git clone --recurse-submodules https://github.com/ProvableHQ/leo && \
#    cd leo && \
#    rustup override set 1.85.1 && \
#    cargo install --path .
#RUN git clone --branch mainnet --single-branch https://github.com/AleoNet/snarkOS.git && \
#    cd snarkOS && \
#    cargo install --locked --path .