FROM rust:1.85.1-bookworm

WORKDIR /build
RUN apt-get update
RUN apt-get install -y wget curl git

RUN curl -L https://sp1up.succinct.xyz | bash
ENV PATH="$PATH:/root/.sp1/bin"
RUN sp1up