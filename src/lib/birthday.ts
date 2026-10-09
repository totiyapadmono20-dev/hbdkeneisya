export const birthdayLetter = "happy birthday to my favorite person, keneisya! 🤍 having you in my life is hands down one of the best things ever. kita emang jauh, terhalang jarak, and honestly, ldr isn’t easy. tapi tiap kali denger suara kamu, it always feels like home. thank you for being you, for your endless patience, and for staying by my side. i’m so incredibly proud of you and everything you do. happy birthday, neis. i miss you so much and enjoy your special day! ✨❤️";
export const birthdayLines = birthdayLetter.split(/(?<=[.!])\s+/);
export type BirthdayTrack = { id: string; title: string; artist: string; chords: [string, string, string, string] };
export const tracks: [BirthdayTrack, BirthdayTrack] = [
  { id: '3HEfLSVUo9rxdD0JxbLAUU', title: 'Love Epiphany', artist: 'Reality Club', chords: ['C', 'G', 'Am', 'F'] },
  { id: '', title: 'A little birthday serenade', artist: 'just for keneisya', chords: ['G', 'D', 'Em', 'C'] },
];
export const chordShapes: Record<string, { tab: string; notes: number[] }> = {
  C: { tab: 'x 3 2 0 1 0', notes: [130.81, 164.81, 196, 261.63, 329.63] },
  G: { tab: '3 2 0 0 0 3', notes: [98, 123.47, 146.83, 196, 246.94, 392] },
  Am: { tab: 'x 0 2 2 1 0', notes: [110, 164.81, 220, 261.63, 329.63] },
  F: { tab: '1 3 3 2 1 1', notes: [87.31, 130.81, 174.61, 220, 261.63, 349.23] },
  D: { tab: 'x x 0 2 3 2', notes: [146.83, 220, 293.66, 369.99] },
  Em: { tab: '0 2 2 0 0 0', notes: [82.41, 123.47, 164.81, 196, 246.94, 329.63] },
};