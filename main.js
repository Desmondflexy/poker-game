// The Game of Poker

// HTML Elements
const p1_span = document.getElementById('p1');
const p2_span = document.getElementById('p2');
const rank_div = document.querySelectorAll('.player p');
const button = document.querySelector('button');
const cards_div = document.querySelectorAll('.cards');
const card_array = create_cards();
const card_suits = ['S', 'H', 'D', 'C'];  // spade, heart, diamond, club
const card_values = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const card_unicodes = get_all_card_unicodes();
let deck_of_cards = get_new_deck_of_cards();

button.addEventListener('click', () => {
    const data = new_deal();
    createPokerHtml(data[1], data[2], data[0]['result'], data[0]['rank1_name'], data[0]['rank2_name'], data[0]['rank1'], data[0]['rank2']);
})

/**create five card divs each for two players and store in a 2x5 array */
function create_cards() {
    const card_array = [];
    for (let i = 0; i < 2; i++) {  // two players
        const card = [];
        for (let j = 0; j < 5; j++) {  // five cards
            const card_div = document.createElement('button');
            card_div.innerHTML = '&#127136;';  // back of card
            card.push(card_div);
            cards_div[i].append(card_div);
            card_div.className = 'card';
        }
        card_array.push(card);
    }
    return card_array;
}

function get_new_deck_of_cards() {
    let deck_of_cards = [];
    card_values.forEach(val => card_suits.forEach(suit => deck_of_cards.push(val + suit)));
    return deck_of_cards;
}

function get_all_card_unicodes() {
    const card_unicodes = { 'cover': '&#127136;' };
    let jj = 0;
    for (let j = 10; j <= 13; j++) {
        let ii = 0;
        for (let i = 1; i <= 14; i++) {
            if (i === 12) continue;
            const card = 'A23456789TJQK'[ii] + 'SHDC'[jj];
            const hex = `1f0${j.toString(16)}${i.toString(16)}`;
            card_unicodes[card] = `&#${parseInt(hex, 16)};`;
            ii++;
        }
        jj++;
    }
    return card_unicodes;
}

/**Deals a random card to player from the deck of cards */
function deal_a_card(player = []) {
    const card = deck_of_cards[get_random_int(0, deck_of_cards.length - 1)];
    const pos = deck_of_cards.indexOf(card);
    player.push(...deck_of_cards.splice(pos, 1));
    return player;
}

/**Compare two hands in a poker game */
function poker_hands(hand1, hand2) {
    const r1 = rank(hand1);
    const r2 = rank(hand2);

    let result
    if (r1[0] > r2[0]) result = 'player1 wins (rank)';
    else if (r1[0] < r2[0]) result = 'player2 wins (rank)';
    else {
        const p1 = handvalue(hand1);
        const p2 = handvalue(hand2);

        if (r1[0] < 2) {
            if (array_compare(p1, p2) > 0) result = 'player1 wins (highest card)';
            else if (array_compare(p1, p2) < 0) result = 'player2 wins (highest card)';
            else result = 'draw';
        } else {
            const a = p1.map(i => count(p1, i));
            const n1 = p1[a.indexOf(Math.max(...a))];
            const b = p2.map(i => count(p2, i));
            const n2 = p2[b.indexOf(Math.max(...b))];

            if (n1 > n2) result = 'player1 wins (high value rank)';
            else if (n1 < n2) result = 'player2 wins (high value rank)';
            else {
                for (let i = 0; i < Math.max(...a); i++) {
                    p1.splice(p1.indexOf(n1), 1);
                    p2.splice(p2.indexOf(n2), 1);
                }
                if (array_compare(p1, p2) > 0) result = 'player1 wins (tie, highest cards)';
                else if (array_compare(p1, p2) < 0) result = 'player2 wins (tie, highest cards)';
                else result = 'draw';
            }
        }
    }
    deck_of_cards = get_new_deck_of_cards();
    console.log(deck_of_cards.length);

    return {
        'rank1': r1[0], 'rank2': r2[0],
        'rank1_name': r1[1], 'rank2_name': r2[1],
        'result': result,
        'full_info': `[${hand1}] ${r1[0]} -- ${r2[0]} [${hand2}] -- ${result}`
    }

    /**Returns the rank of a hand in the card game of poker.*/
    function rank(hand) {
        const hand_values = hand.map(i => i[0]);
        const big_card_values = card_values.slice(8);
        if (big_card_values.every(i => hand_values.includes(i)) && is_same_suit()) {
            return [10, 'Royal Flush'];

        } else if (isconsecutive() && is_same_suit()) {
            return [9, 'Straight Flush'];

        } else if (n_of_a_kind(4) > 0) {
            return [8, 'Four of a Kind'];

        } else if (n_of_a_kind(3) > 0 && n_of_a_kind(2)) {
            return [7, 'Full House'];

        } else if (is_same_suit()) {
            return [6, 'Flush'];

        } else if (isconsecutive()) {
            return [5, 'Straight'];

        } else if (n_of_a_kind(3) > 0) {
            return [4, 'Three of a Kind'];

        } else if (n_of_a_kind(2) > 1) {
            return [3, 'Two Pairs'];

        } else return n_of_a_kind(2) > 0 ? [2, 'One Pair'] : [1, 'High Card'];

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
}

/**Returns the number of occurence of an element in an array */
function count(arr, elem) {
    return arr.filter(i => i === elem).length;
}

/**Compare two arrays -- arr1 > arr2*/
function array_compare(arr1, arr2) {
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] > arr2[i]) return 1;
        if (arr1[i] < arr2[i]) return -1;
        if (arr1[i] === arr2[i]) continue;
    }
    return 0;
}

/**Get a random integer in the interval [min, max] */
function get_random_int(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function createPokerHtml(hand1, hand2, result, r1Name, r2Name, r1, r2) {
    const players = [hand1, hand2];
    const rName = [r1Name, r2Name];
    const r = [r1, r2];
    for (let i = 0; i < 2; i++) {  // player
        for (let j = 0; j < 5; j++) {  // card
            const card_div = card_array[i][j];
            const card = players[i][j];
            card_div.innerHTML = card_unicodes[card];
            let class_name;
            if (card.includes('D') || card.includes('H')) {
                card_div.className = 'red card';
                class_name = 'red card';
            } else {
                card_div.className = 'black card';
                class_name = 'black card';
            }
            card_div.addEventListener('click', () => flipCard(card_div, card_unicodes[card], class_name));
        }
        rank_div[i].innerHTML = `${rName[i]} <${r[i]}>`;
    }

    if (result.includes('player1')) {
        p1_span.innerHTML = 'wins';
        p2_span.innerHTML = 'loses';
        p1_span.parentElement.parentElement.className = 'player winner';
        p2_span.parentElement.parentElement.className = 'player loser';
    } else if (result.includes('player2')) {
        p1_span.innerHTML = 'loses';
        p2_span.innerHTML = 'wins';
        p1_span.parentElement.parentElement.className = 'player loser';
        p2_span.parentElement.parentElement.className = 'player winner';
    } else p1_span.innerHTML = p2_span.innerHTML = 'draws';
}

function new_deal() {
    // clear html elements before restart
    p1_span.innerHTML = p2_span.innerHTML = '';
    const hand1 = [];
    const hand2 = [];
    for (let i = 0; i < 5; i++) {
        deal_a_card(hand1);
        deal_a_card(hand2)
    }
    const data = poker_hands(hand1, hand2);
    return [data, hand1, hand2];
}

// not working as expected, card does not flip on 2nd run
function flipCard(card_div, card, class_name) {
    /**Get the unicode of a card */
    // const ucode = (card) => '&#' + card.codePointAt() + ';';
    // if (ucode(card_div.innerHTML) === '&#127136;') {
    //     card_div.innerHTML = card;
    //     card_div.className = class_name;
    // } else {
    //     card_div.innerHTML = '&#127136;';
    //     card_div.className = 'card';
    // }
}
