// The Game of Poker
const cards_divs = document.querySelectorAll('.cards');
const p1_span = document.getElementById('p1');
const p2_span = document.getElementById('p2');
const card_suits = ['S', 'H', 'D', 'C'];  // spade, heart, diamond, club
const card_values = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const deck = [];
card_values.forEach(val => card_suits.forEach(suit => deck.push(val + suit)));
const deck_div = document.querySelector('.deck');
const card_unicodes = { 'cover': '&#127136;' };

let jj = 0;
for (let j = 10; j <= 13; j++) {
    let ii = 0;
    for (let i = 1; i <= 14; i++) {
        if (i === 12) continue;
        const card = 'A23456789TJQK'[ii] + 'SHDC'[jj];
        const hex = `1f0${j.toString(16)}${i.toString(16)}`;
        card_unicodes[card] = `&#${parseInt(hex, 16)};`;
        const card_div = document.createElement('div');
        card_div.innerHTML = card_unicodes[card];
        if (card.includes('D') || card.includes('H')) {
            card_div.className = 'red card';
        } else card_div.className = 'black card';
        deck_div.append(card_div);
        ii++;
    }
    jj++;
}

for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 5; j++) {
        const card_div = document.createElement('div');
        card_div.innerHTML = card_unicodes['cover'];
        cards_divs[i].append(card_div);
        card_div.className = 'card';
    }
}

/**Deals a random card to player from the deck of cards */
function deal_a_card(player) {
    const card = deck[getRandomInt(0, deck.length - 1)];
    const pos = deck.indexOf(card);
    player.push(...deck.splice(pos, 1));
    return player;
}

/**Returns the rank of a hand in the card game of poker.*/
function rank(hand) {
    // Royal flush -- 10
    const hand_values = hand.map(i => i[0]);
    const big_card_values = card_values.slice(8);
    if (big_card_values.every(i => hand_values.includes(i)) && is_same_suit()) return 10;
    // Straight flush -- 9
    if (isconsecutive() && is_same_suit()) return 9;
    // Four of a kind -- 8
    if (n_of_a_kind(4) > 0) return 8;
    // Full house -- 7
    if (n_of_a_kind(3) > 0 && n_of_a_kind(2)) return 7;
    // Flush -- 6
    if (is_same_suit()) return 6;
    // Straight -- 5
    if (isconsecutive()) return 5;
    // Three of a kind -- 4
    if (n_of_a_kind(3) > 0) return 4;
    // Two pair -- 3
    if (n_of_a_kind(2) > 1) return 3;
    // One pair -- 2 otherwise High card -- 1
    return n_of_a_kind(2) > 0 ? 2 : 1;

    /**Checks if card values are consecutive */
    function isconsecutive() {
        const d = hand.map(i => card_values.indexOf(i[0]));
        d.sort((a, b) => a - b);
        const a = d.map(i => card_values[i]).join('');
        const b = card_values.join('');
        for (let i = 0; i < b.length - 5; i++) if (a === b.slice(i, i + 5)) return true;
        return false;
    }

    /**Returns number of occurrence of n of a kind. */
    function n_of_a_kind(n) {
        const kind = {};
        for (let i = 0; i < hand.length; i++) {
            val = hand[i][0];
            if (!Object.keys(kind).includes(val)) {
                kind[val] = 1;
            } else {
                kind[val]++;
            }
        }
        return count(Object.values(kind), n);
    }

    /**Checks if cards are same suit. */
    function is_same_suit() {
        const hand_suits = hand.map(i => i[1]);
        const unique_hand_suits = new Set(hand_suits);
        return Array.from(unique_hand_suits).length === 1;
    }
}

/**Converts cards in hand to values in descending order. */
function handvalue(hand) {
    const val = hand.map(card => card[0]);
    const lst = val.map(v => card_values.indexOf(v) + 2);
    return lst.map(i => i).sort((x, y) => y - x);
}

/**Two players play a  game of poker */
function play_poker() {
    // Random hands dealt to two players
    const player_1 = [];
    const player_2 = [];
    for (let i = 0; i < 5; i++) {
        deal_a_card(player_1);
        deal_a_card(player_2)
    }
    const r1 = rank(player_1);
    const r2 = rank(player_2);

    let result
    if (r1 > r2) result = 'player1_wins (rank)';
    else if (r1 < r2) result = 'player2_wins (rank)';
    else {
        const p1 = handvalue(player_1);
        const p2 = handvalue(player_2);

        if (r1 < 2) {
            if (arrayCompare(p1, p2) > 0) result = 'player1_wins (highest_card)';
            else if (arrayCompare(p1, p2) < 0) result = 'player2_wins (highest_card)';
            else result = 'draw';
        } else {
            const a = p1.map(i => count(p1, i));
            const n1 = p1[a.indexOf(Math.max(...a))];
            const b = p2.map(i => count(p2, i));
            const n2 = p2[b.indexOf(Math.max(...b))];

            if (n1 > n2) result = 'player1_wins (high_value_rank)';
            else if (n1 < n2) result = 'player2_wins (high_value_rank)';
            else {
                for (let i = 0; i < Math.max(...a); i++) {
                    p1.splice(p1.indexOf(n1), 1);
                    p2.splice(p2.indexOf(n2), 1);
                }
                if (arrayCompare(p1, p2) > 0) result = 'player1_wins (tie__highest_cards)';
                else if (arrayCompare(p1, p2) < 0) result = 'player2_wins (tie__highest_cards)';
                else result = 'draw';
            }
        }
    }
    // print result to console
    // if ((r1 > 0 || r2 > 0) && (result.includes(''))) {
    //     console.log(`[${player_1}] ${r1} -- ${r2} [${player_2}] -- ${result}`);
    // }

    const players = [player_1, player_2];
    const rank_divs = document.querySelectorAll('.rank');

    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 5; j++) {
            const card_div = document.createElement('div');
            const card = players[i][j];
            card_div.innerHTML = card_unicodes[card];
            cards_divs[i].append(card_div);
            if (card.includes('D') || card.includes('H')) {
                card_div.className = 'red card';
            } else card_div.className = 'black card';
        }
        rank_divs[i].innerHTML = define_rank(players[i]);
    }

    if (result.includes('player1')){
        p1_span.innerHTML = 'wins';
        p2_span.innerHTML = 'loses';
        p1_span.parentElement.parentElement.className = 'player winner';
        p2_span.parentElement.parentElement.className = 'player loser';
    } else if (result.includes('player2')) {
        p1_span.innerHTML = 'loses';
        p2_span.innerHTML = 'wins';
        p1_span.parentElement.parentElement.className = 'player loser';
        p2_span.parentElement.parentElement.className = 'player winner';
    } else {
        p1_span.innerHTML = p2_span.innerHTML = 'draws';
    }

    // Both players drop their cards back on the deck
    deck.push(...player_1, ...player_2);
    player_1.splice(0);
    player_2.splice(0);
}


/**Returns the number of occurence of an element in an array */
function count(arr, elem) {
    return arr.filter(i => i === elem).length;
}

/**Compare two arrays -- arr1 > arr2*/
function arrayCompare(arr1, arr2) {
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] > arr2[i]) return 1;
        if (arr1[i] < arr2[i]) return -1;
        if (arr1[i] === arr2[i]) continue;
    }
    return 0;
}

/**Get a random integer in the interval [min, max] */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function define_rank(player) {
    switch (rank(player)) {
        case 10:
            return 'Royal Flush';
        case 9:
            return 'Straight Flush';
        case 8:
            return 'Four of a Kind';
        case 7:
            return 'Full House';
        case 6:
            return 'Flush';
        case 5:
            return 'Straght';
        case 4:
            return 'Three of a Kind';
        case 3:
            return 'Two Pairs';
        case 2:
            return 'One Pair';
        default:
            return 'High Card';
    }
}

// button click will deal a card
document.querySelector('button').addEventListener('click', () => {
    // clear html elements before restart
    for (let i = 0; i < 2; i++) {
        cards_divs[i].innerHTML = '';
    }
    p1_span.innerHTML = p2_span.innerHTML = '';
    play_poker();
})
//*********************************************** */

