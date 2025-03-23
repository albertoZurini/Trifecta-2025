program foo.aleo;

function hello:
    input priv_input_1 as u32.private;
    input pub_input_2 as u32.public;
    assert.eq priv_input_1 pub_input_2
