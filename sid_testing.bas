00 rem d020 is border colour, i.e. 53280
10 for i = 5 to 15: poke 53280, i: next i

00 rem based on tone example at http://goo.gl/tIDtAy
05 rem sid is at d400 = 54272
10 sid=54272
12 rem high nibble multiplier
13 high=16
15 rem clear 28 sid bytes
20 for i = 0 to 28 : poke sid + i, 0 : next
25 rem set volume segment of d418 (3 bits) to maximum %111
30 poke sid + 24, 15
35 rem everything here will act on voice 1.
36 rem play a D, frequency value 10001. Low byte 17...
38 poke sid, 17
39 rem ...and high byte 39, since (39*256) + 17 = 10001
40 poke sid + 1, 39
45 rem set both attack and delay nibbles to 0 - i.e. we just sustain
46 rem multiply attack by 16 (high nibble) and add decay (low)
50 poke sid + 5, 0*high + 0
55 rem set sustain volume to maximum 15, set release length to 10 (1500ms)
60 poke sid + 6, 15*high + 10
65 rem set control bits 0 (start cycle) and 4 (triangle wave)
70 poke sid + 4, 1 + 16
75 rem unset control bit 0 (start release) and keep set bit 4 (triangle wave)
76 rem immediately starts releasing from our sustain volume, so zero A/D/S.
80 poke sid + 4, 16


00 rem my first demo. changing volume gives a click
10 sid=54272 : volume=sid+24
20 col=53280
30 for i = 0 to 28 : poke sid + i, 0 : next
40 for i = 0 to 15 : poke volume, i : poke col, i : next
50 goto 40

Single-byte nibbles
- To calculate a high nibble, multiply by 16.
Double bytes
- To calculate the high byte, multiple by 256.
