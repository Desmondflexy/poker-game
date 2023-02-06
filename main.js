// // The Game of Poker

// const p1_span = document.getElementById('p1');
// const p2_span = document.getElementById('p2');
// const card_array = createCards();
// const card_unicodes = getCardUnicodes();
// const card_values = Array.from('23456789TJQKA');

// let deck_of_cards = getDeckOfCards();

// /**Create five card divs each for two players and store in a 2x5 array */
// function createCards() {
//     const card_array = [];
//     for (let i = 0; i < 2; i++) {  // two players
//         const card = [];
//         for (let j = 0; j < 5; j++) {  // five cards
//             const card_div = document.createElement('button');
//             document.querySelectorAll('.cards')[i].append(card_div);
//             card_div.innerHTML = '&#127136;';  // back of card
//             card.push(card_div);
//             card_div.className = 'card';
//         }
//         card_array.push(card);
//     }
//     return card_array;
// }

// function getDeckOfCards() {
//     let deck_of_cards = [];
//     card_values.forEach(val => Array.from('SHDC').forEach(suit => deck_of_cards.push(val + suit)));
//     return deck_of_cards;
// }

// function getCardUnicodes() {
//     const card_unicodes = {};
//     let jj = 0;
//     for (let j = 10; j <= 13; j++) {
//         let ii = 0;
//         for (let i = 1; i <= 14; i++) {
//             if (i === 12) continue;
//             const card = 'A23456789TJQK'[ii] + 'SHDC'[jj];
//             const hex = `1f0${j.toString(16)}${i.toString(16)}`;
//             card_unicodes[card] = `&#${parseInt(hex, 16)};`;
//             ii++;
//         }
//         jj++;
//     }
//     return card_unicodes;
// }

// /**Deals a random card to player from the deck of cards */
// function dealCard(player) {
//     const card = deck_of_cards[getRandomInt(0, deck_of_cards.length - 1)];
//     const pos = deck_of_cards.indexOf(card);
//     player.push(...deck_of_cards.splice(pos, 1));
//     return player;

//     /**Get a random integer in the interval [min, max] */
//     function getRandomInt(min, max) {
//         min = Math.ceil(min);
//         max = Math.floor(max);
//         return Math.floor(Math.random() * (max - min + 1) + min);
//     }
// }

// /**Compare two hands in a poker game */
// function pokerHands(hand1, hand2) {
//     const r1 = rank(hand1);
//     const r2 = rank(hand2);

//     let result
//     if (r1[0] > r2[0]) result = 'player1 wins (rank)';
//     else if (r1[0] < r2[0]) result = 'player2 wins (rank)';
//     else {
//         const p1 = handvalue(hand1);
//         const p2 = handvalue(hand2);

//         if (r1[0] < 2) {
//             if (arrayCompare(p1, p2) > 0) result = 'player1 wins (highest card)';
//             else if (arrayCompare(p1, p2) < 0) result = 'player2 wins (highest card)';
//             else result = 'draw';
//         } else {
//             const a = p1.map(i => count(p1, i));
//             const n1 = p1[a.indexOf(Math.max(...a))];
//             const b = p2.map(i => count(p2, i));
//             const n2 = p2[b.indexOf(Math.max(...b))];

//             if (n1 > n2) result = 'player1 wins (high value rank)';
//             else if (n1 < n2) result = 'player2 wins (high value rank)';
//             else {
//                 for (let i = 0; i < Math.max(...a); i++) {
//                     p1.splice(p1.indexOf(n1), 1);
//                     p2.splice(p2.indexOf(n2), 1);
//                 }
//                 if (arrayCompare(p1, p2) > 0) result = 'player1 wins (tie, highest cards)';
//                 else if (arrayCompare(p1, p2) < 0) result = 'player2 wins (tie, highest cards)';
//                 else result = 'draw';
//             }
//         }
//     }
//     return {
//         'rank': [r1[2], r2[2]],
//         'rank_name': [r1[1], r2[1]],
//         'rank_pts': [r1[0], r2[0]],
//         'result': result,
//         // 'info': `[${hand1}] ${r1[0]} -- ${r2[0]} [${hand2}] -- ${result}`
//     }

//     /**Returns the rank of a hand in the card game of poker.*/
//     function rank(hand) {
//         if (Array.from('TJQKA').every(i => hand.map(j => j[0]).includes(i)) && isSameSuit()) {
//             return [10, 'Royal Flush', '1st'];

//         } else if (isConsecutive() && isSameSuit()) {
//             return [9, 'Straight Flush', '2nd'];

//         } else if (nOfaKind(4) > 0) {
//             return [8, 'Four of a Kind', '3rd'];

//         } else if (nOfaKind(3) > 0 && nOfaKind(2)) {
//             return [7, 'Full House', '4th'];

//         } else if (isSameSuit()) {
//             return [6, 'Flush', '5th'];

//         } else if (isConsecutive()) {
//             return [5, 'Straight', '6th'];

//         } else if (nOfaKind(3) > 0) {
//             return [4, 'Three of a Kind', '7th'];

//         } else if (nOfaKind(2) > 1) {
//             return [3, 'Two Pairs', '8th'];

//         } else return nOfaKind(2) > 0 ? [2, 'One Pair', '9th'] : [1, 'High Card', '10th'];

//         /**Checks if card values are consecutive */
//         function isConsecutive() {
//             const d = hand.map(i => card_values.indexOf(i[0]));
//             d.sort((a, b) => a - b);
//             const a = d.map(i => card_values[i]).join('');
//             const b = card_values.join('');
//             for (let i = 0; i < b.length - 5; i++) if (a === b.slice(i, i + 5)) return true;
//             return false;
//         }

//         /**Returns number of occurrence of n of a kind. */
//         function nOfaKind(n) {
//             const kind = {};
//             for (let i = 0; i < hand.length; i++) {
//                 val = hand[i][0];
//                 if (!Object.keys(kind).includes(val)) {
//                     kind[val] = 1;
//                 } else {
//                     kind[val]++;
//                 }
//             }
//             return count(Object.values(kind), n);
//         }

//         /**Checks if cards are same suit. */
//         function isSameSuit() {
//             const hand_suits = hand.map(i => i[1]);
//             const unique = new Set(hand_suits);
//             return Array.from(unique).length === 1;
//         }
//     }

//     /**Converts cards in hand to values in descending order. */
//     function handvalue(hand) {
//         const val = hand.map(card => card[0]);
//         const lst = val.map(v => card_values.indexOf(v) + 2);
//         return lst.map(i => i).sort((x, y) => y - x);
//     }

//     /**Returns the number of occurence of an element in an array */
//     function count(arr, elem) {
//         return arr.filter(i => i === elem).length;
//     }

//     /**Compare two arrays -- arr1 > arr2*/
//     function arrayCompare(arr1, arr2) {
//         for (let i = 0; i < arr1.length; i++) {
//             if (arr1[i] > arr2[i]) return 1;
//             if (arr1[i] < arr2[i]) return -1;
//             if (arr1[i] === arr2[i]) continue;
//         }
//         return 0;
//     }
// }

// function createPokerHtml(hand, result, rName, r) {
//     for (let i = 0; i < 2; i++) {  // player
//         for (let j = 0; j < 5; j++) {  // card
//             const card_div = card_array[i][j];
//             const card = hand[i][j];
//             card_div.innerHTML = card_unicodes[card];
//             let class_name;
//             if (card.includes('D') || card.includes('H')) {
//                 card_div.className = 'red card';
//                 class_name = 'red card';
//             } else {
//                 card_div.className = 'black card';
//                 class_name = 'black card';
//             }
//             card_div.onclick = () => flipCard(card_div, card_unicodes[card], class_name);
//         }
//         document.querySelectorAll('.player p')[i].innerHTML = `${rName[i]} <${r[i]}>`;
//     }

//     if (result.includes('player1')) {
//         p1_span.innerHTML = 'wins';
//         p2_span.innerHTML = 'loses';
//         p1_span.parentElement.parentElement.className = 'player winner';
//         p2_span.parentElement.parentElement.className = 'player loser';
//     } else if (result.includes('player2')) {
//         p1_span.innerHTML = 'loses';
//         p2_span.innerHTML = 'wins';
//         p1_span.parentElement.parentElement.className = 'player loser';
//         p2_span.parentElement.parentElement.className = 'player winner';
//     } else p1_span.innerHTML = p2_span.innerHTML = 'draws';

//     return;
// }

// function newDeal() {
//     // clear html elements before restart
//     p1_span.innerHTML = p2_span.innerHTML = '';
//     const hand1 = [];
//     const hand2 = [];
//     for (let i = 0; i < 5; i++) {
//         dealCard(hand1);
//         dealCard(hand2)
//     }
//     const data = pokerHands(hand1, hand2);
//     deck_of_cards = getDeckOfCards();
//     return [data, [hand1, hand2]];
// }

// function flipCard(card_div, card, class_name) {
//     if (card_div.innerHTML.codePointAt() === 127136) {
//         card_div.innerHTML = card;
//         card_div.className = class_name;
//     } else {
//         card_div.innerHTML = '&#127136;';
//         card_div.className = 'back card';
//     }
//     return;
// }

// document.querySelector('.button').addEventListener('click', () => {
//     let hand, rank, rank_name, result, pts;
//     // run until a hand rank in not less than n
//     do {
//         const n = 1;
//         const data = newDeal();
//         rank = data[0]['rank'];
//         rank_name = data[0]['rank_name'];
//         result = data[0]['result'];
//         pts = data[0]['rank_pts'];
//         hand = data[1];
//         if (pts[0] >= n || pts[1] >= n) break;
//     } while (true);
//     createPokerHtml(hand, result, rank_name, rank);
// })
