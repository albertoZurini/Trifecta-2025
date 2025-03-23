//! A simple program that takes a number `n` as input, and writes the `n-1`th and `n`th fibonacci
//! number as an output.

// These two lines are necessary for the program to properly compile.
//
// Under the hood, we wrap your main function with some extra code so that it behaves properly
// inside the zkVM.
#![no_main]
sp1_zkvm::entrypoint!(main);

use alloy_sol_types::SolType;

pub fn main() {
    let priv_input_3 = sp1_zkvm::io::read::<u32>();
    let pub_input_1 = sp1_zkvm::io::read::<u32>();
    let pub_input_4 = sp1_zkvm::io::read::<u32>();

    let output = priv_input_3 == pub_input_1;
    sp1_zkvm::io::commit_slice(&[output as u8]);
}
