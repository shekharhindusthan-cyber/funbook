export type BookPage = {
  text: string;
  art: string;
};

export type QuizQuestion = {
  question: string;
  options: string[];
  answer: number;
};

export type BookColor = "coral" | "sun" | "teal" | "grape" | "sky";

export type Book = {
  slug: string;
  title: string;
  emoji: string;
  tagline: string;
  color: BookColor;
  cover: string[];
  pages: BookPage[];
  quiz: QuizQuestion[];
  sticker: string;
  stickerLabel: string;
  stars: number;
};

export const books: Book[] = [
  {
    slug: "little-safari",
    title: "Little Safari",
    emoji: "🦁",
    tagline: "Wake up with Lala the lion cub.",
    color: "coral",
    cover: ["🦁", "🦓", "🐘", "🌞"],
    sticker: "🦁",
    stickerLabel: "Safari Friend",
    stars: 3,
    pages: [
      {
        art: "🌞",
        text: "The sun wakes up over the savanna. A little lion named Lala stretches her paws and gives a tiny roar. “Good morning, world!”",
      },
      {
        art: "🦓",
        text: "Lala meets Zebra Zuri, who is counting her stripes. “One, two, three… I keep losing count!” Lala giggles. “Let’s count together!”",
      },
      {
        art: "🐘",
        text: "Splash! Elephant Eli sprays water with his long trunk. “This is the best shower in the whole world,” he trumpets.",
      },
      {
        art: "🌙",
        text: "At sunset, all the animals gather under the big acacia tree. Fireflies blink like tiny lanterns. “Same time tomorrow?” asks Lala. “Always!” they cheer.",
      },
    ],
    quiz: [
      {
        question: "Who is the little lion?",
        options: ["Lala", "Zuri", "Eli"],
        answer: 0,
      },
      {
        question: "What does Eli spray water with?",
        options: ["His tail", "His trunk", "A bucket"],
        answer: 1,
      },
      {
        question: "When do the animals gather under the tree?",
        options: ["At sunrise", "At lunchtime", "At sunset"],
        answer: 2,
      },
    ],
  },
  {
    slug: "space-explorers",
    title: "Space Explorers",
    emoji: "🚀",
    tagline: "Blast off with Captain Nia and Pip.",
    color: "grape",
    cover: ["🚀", "🌙", "⭐", "🤖"],
    sticker: "🚀",
    stickerLabel: "Star Captain",
    stars: 3,
    pages: [
      {
        art: "🚀",
        text: "Captain Nia checks her helmet: click! She climbs into the shiny rocket. “Three… two… one… blast off!”",
      },
      {
        art: "🌙",
        text: "Up in space, the stars look like glitter spilled on a dark blanket. Nia waves at the Moon. “Hello, old friend!”",
      },
      {
        art: "🤖",
        text: "A friendly robot named Pip floats by. “Beep boop! I brought a snack for the journey,” says Pip, holding a bag of star-shaped cookies.",
      },
      {
        art: "🪐",
        text: "They land on a squishy purple planet and bounce higher than trees. Nia plants a tiny flag that says: NIA WAS HERE.",
      },
    ],
    quiz: [
      {
        question: "What is the robot’s name?",
        options: ["Pip", "Nia", "Boop"],
        answer: 0,
      },
      {
        question: "What shape are the cookies?",
        options: ["Round", "Star-shaped", "Square"],
        answer: 1,
      },
      {
        question: "Where do Nia and Pip bounce?",
        options: ["On the Moon", "In the ocean", "On a purple planet"],
        answer: 2,
      },
    ],
  },
  {
    slug: "ocean-friends",
    title: "Ocean Friends",
    emoji: "🐙",
    tagline: "Dive down with Oli the octopus.",
    color: "teal",
    cover: ["🐙", "🐢", "🦀", "🐚"],
    sticker: "🐙",
    stickerLabel: "Ocean Buddy",
    stars: 3,
    pages: [
      {
        art: "🌊",
        text: "Down, down, down goes Oli the octopus, past swaying seaweed and sleepy seahorses.",
      },
      {
        art: "🦀",
        text: "Oli has eight arms and eight tickles. “Tickle fight!” shouts Crab Carla, snapping her claws.",
      },
      {
        art: "🐢",
        text: "A shy turtle named Tilly hides in her shell. Oli waits quietly, then offers her a shiny shell. “Friends?” “Friends!”",
      },
      {
        art: "🐚",
        text: "When the moon shines on the water, the friends make bubble crowns and sing a wobbly song.",
      },
    ],
    quiz: [
      {
        question: "How many arms does Oli have?",
        options: ["Six", "Eight", "Ten"],
        answer: 1,
      },
      {
        question: "Who is shy and hides in a shell?",
        options: ["Carla the crab", "Tilly the turtle", "Oli the octopus"],
        answer: 1,
      },
      {
        question: "What do the friends wear at night?",
        options: ["Bubble crowns", "Party hats", "Scarves"],
        answer: 0,
      },
    ],
  },
];

export function getBook(slug: string): Book | undefined {
  return books.find((book) => book.slug === slug);
}

export const avatars = ["🦊", "🐼", "🐯", "🐸", "🦄", "🐧", "🐨", "🐙"];
