fn main(
    priv_input_3: u8, pub_input_1: pub u8, pub_input_4: pub u8
) {
    assert(priv_input_3 == pub_input_1);
    assert(pub_input_1 + pub_input_4 == priv_input_3);
}