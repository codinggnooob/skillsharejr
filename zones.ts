import type { Zone } from './types'

// Buildings laid out on a 64x44 tile map, ringed around a central plaza.
export const ZONES: Zone[] = [
  {
    id: 'bank', name: 'Bank of Life', skill: 'Money Smarts', icon: '🏦',
    tagline: 'Needs vs wants, saving and budgeting',
    color: '#f59e0b', dark: '#92400e', x: 5, y: 4, w: 9, h: 6,
    learnings: [
      'Needs come before wants.',
      'Pay yourself first — save before you spend.',
      'A budget is a plan that tells your money where to go.',
    ],
    npc: {
      name: 'Penny', role: 'Town Banker', emoji: '👩‍💼', palette: 3,
      intro: [
        'Psst! Over here, Hero! I\'m Penny, the town banker. Welcome to the Bank of Life!',
        'The Skill Beacon won\'t relight with empty pockets — money smarts are a life skill too, you know.',
        'Show me you can tell NEEDS from WANTS and budget like a pro... and my Money Badge is yours!',
      ],
      prompt: 'Back for more? Wonderful! My vault of challenges never runs empty. Ready?',
      congrats: 'CHA-CHING! That\'s money mastery! The Beacon glows a little brighter tonight!',
    },
  },
  {
    id: 'safety', name: 'Safety HQ', skill: 'Disaster Ready', icon: '🚨',
    tagline: 'Emergency kits and what to do when it matters',
    color: '#ef4444', dark: '#7f1d1d', x: 28, y: 4, w: 9, h: 6,
    learnings: [
      'A go-bag holds water, light, first aid and a whistle.',
      'Earthquake: Drop, Cover, Hold On.',
      'In a fire: get out, stay low, call for help — never go back in.',
    ],
    npc: {
      name: 'Captain Blaze', role: 'Fire Chief', emoji: '🧑‍🚒', palette: 0,
      intro: [
        'Captain Blaze, Fire Chief, at your service! Stand tall, recruit!',
        'When disaster strikes, panic is the enemy — PREPARATION is the hero. This station trains the ready.',
        'Pack a real go-bag and prove you know what to do when seconds count. Earn your Safety Badge!',
      ],
      prompt: 'Recruit! Ready for another drill? Emergencies don\'t wait — neither do we!',
      congrats: 'OUTSTANDING, recruit! With heroes like you, this town is ready for anything!',
    },
  },
  {
    id: 'robo', name: 'Robo Lab', skill: 'Robotics', icon: '🤖',
    tagline: 'Give a robot clear instructions to reach its goal',
    color: '#06b6d4', dark: '#164e63', x: 51, y: 4, w: 9, h: 6,
    learnings: [
      'Robots do exactly what you tell them — nothing more.',
      'Break big paths into small steps: move, turn, repeat.',
      'Sensors are how robots "see" walls and obstacles.',
    ],
    npc: {
      name: 'Dr. Volt', role: 'Robotics Engineer', emoji: '🧑‍🔬', palette: 1,
      intro: [
        'Beep-boop! Oh — sorry, force of habit. Dr. Volt, robotics engineer, at your service!',
        'My robots only move when given PERFECT instructions. Not almost-perfect. PERFECT.',
        'Think you can out-program a machine? Guide my bot to the goal and the Robo Badge is yours!',
      ],
      prompt: 'The bots are charged and ready for another run. Shall we?',
      congrats: 'BEEP-BOOP-HOORAY! You think like a true engineer — the Beacon hums with new energy!',
    },
  },
  {
    id: 'code', name: 'Code Dojo', skill: 'Coding', icon: '💻',
    tagline: 'Sequences, loops and bug hunting',
    color: '#8b5cf6', dark: '#4c1d95', x: 5, y: 18, w: 9, h: 6,
    learnings: [
      'Code is a sequence of steps, in the right order.',
      'Loops repeat steps so you don’t have to.',
      'Every bug can be found by reading the code slowly.',
    ],
    npc: {
      name: 'Sensei Byte', role: 'Coding Master', emoji: '🥷', palette: 2,
      intro: [
        'Welcome to the Dojo, young student. I am Sensei Byte.',
        'Code is not magic. It is discipline: the right steps, in the right order, repeated with patience.',
        'Show me your sequence, your loops, your logic. The Code Badge awaits the worthy.',
      ],
      prompt: 'Ah, the student returns. The path of code has no end. Shall we train?',
      congrats: 'Discipline. Logic. Victory. The Code Badge is yours, young master. The Beacon flickers awake!',
    },
  },
  {
    id: 'ai', name: 'AI Hub', skill: 'AI Literacy', icon: '🧠',
    tagline: 'Train a mini AI and learn how it thinks',
    color: '#ec4899', dark: '#831843', x: 51, y: 18, w: 9, h: 6,
    learnings: [
      'AI learns from examples (data) that people give it.',
      'Better and more varied data makes smarter AI.',
      'AI can be wrong or biased — always think for yourself.',
    ],
    npc: {
      name: 'Professor Nova', role: 'AI Researcher', emoji: '👩‍🔬', palette: 3,
      intro: [
        'Oh! A visitor! I\'m Professor Nova — I teach machines to learn. Yes, TEACH them!',
        'AI isn\'t a magic brain. It\'s a student that learns from examples. Good examples, smart AI. Bad ones... well.',
        'Train my mini-AI and prove you understand how it thinks. The AI Badge could be yours!',
      ],
      prompt: 'The neural nets are warmed up and waiting. Ready to train another model?',
      congrats: 'INCREDIBLE! You understand AI better than most adults! The Beacon shines brighter!',
    },
  },
  {
    id: 'media', name: 'Truth Library', skill: 'Media & Thinking', icon: '📰',
    tagline: 'Spot facts, opinions and online tricks',
    color: '#3b82f6', dark: '#1e3a8a', x: 5, y: 32, w: 9, h: 6,
    learnings: [
      'A fact can be checked. An opinion is a feeling.',
      'If a message pressures you to click or pay — it’s a trick.',
      'Check the source before you share.',
    ],
    npc: {
      name: 'Sage', role: 'Librarian', emoji: '🧙', palette: 1,
      intro: [
        'Shhh... welcome to the Truth Library, young seeker. I am Sage, keeper of these halls.',
        'These days, tricks hide between facts like weeds among flowers. Many are fooled. Few look closely.',
        'Sort FACT from OPINION from TRICK, and the Truth Badge shall be yours.',
      ],
      prompt: 'The shelves whisper with new puzzles, seeker. Care to test your eyes again?',
      congrats: 'A sharp mind like yours cannot be fooled. Go — spread the truth and light the Beacon!',
    },
  },
  {
    id: 'wellness', name: 'Wellness Center', skill: 'Health & Emotions', icon: '💚',
    tagline: 'Fuel your body and understand feelings',
    color: '#22c55e', dark: '#14532d', x: 28, y: 32, w: 9, h: 6,
    learnings: [
      'A balanced plate has plants, protein, grains and water.',
      'All feelings are okay — what matters is what we do with them.',
      'Asking for help is a strength, not a weakness.',
    ],
    npc: {
      name: 'Coach Willow', role: 'Wellness Coach', emoji: '🧑‍🏫', palette: 2,
      intro: [
        'Hey champ! Coach Willow here! Welcome to the Wellness Center!',
        'A strong hero needs a strong body AND a kind heart. Muscles alone don\'t light Beacons!',
        'Build a power plate and show me you understand feelings — that\'s REAL strength. Go for the badge!',
      ],
      prompt: 'Champ! Back for another workout — for body AND mind? Let\'s go!',
      congrats: 'Strong body, kind heart — you\'re the whole package, champ! The Beacon feels it too!',
    },
  },
  {
    id: 'time', name: 'Time Tower', skill: 'Planning & Focus', icon: '⏰',
    tagline: 'Sort what to do first, later, or not at all',
    color: '#f97316', dark: '#7c2d12', x: 51, y: 32, w: 9, h: 6,
    learnings: [
      'Do what is urgent AND important first.',
      'Big tasks get easier when sliced into small ones.',
      'Rest and play are part of a good plan too.',
    ],
    npc: {
      name: 'Tick', role: 'Clockkeeper', emoji: '🕵️', palette: 0,
      intro: [
        'Tick-tock, tick-tock! Right on time! I\'m Tick, keeper of the Time Tower.',
        'Everyone gets 24 hours a day — heroes just spend them WISELY.',
        'Sort these tasks by what truly matters, and the Time Badge is yours. The clock is ticking!',
      ],
      prompt: 'Tick-tock! Time for another round? Pun absolutely intended.',
      congrats: 'Tick-TERRIFIC! You\'ve mastered time itself — and right on schedule for the Beacon!',
    },
  },
  {
    id: 'green', name: 'Green Park', skill: 'Earth & Community', icon: '🌍',
    tagline: 'Recycle right and care for your world',
    color: '#84cc16', dark: '#365314', x: 28, y: 18, w: 9, h: 6,
    learnings: [
      'Recycle, compost, trash — sorting keeps Earth clean.',
      'Small habits (lights off, less waste) add up.',
      'Communities get stronger when everyone helps.',
    ],
    npc: {
      name: 'Ranger Fern', role: 'Park Ranger', emoji: '🧑‍🌾', palette: 1,
      intro: [
        'Welcome to the greenhouse, Hero! Ranger Fern, at your service.',
        'This town — this whole planet — is our shared home. And homes need care.',
        'Sort the waste right and prove you\'ll protect what we share. The Earth Badge awaits!',
      ],
      prompt: 'The plants perked up when you walked in! Ready for another green challenge?',
      congrats: 'The Earth thanks you, Hero! One badge closer to relighting the Beacon!',
    },
  },
]

export const zoneById = (id: string) => ZONES.find((z) => z.id === id)
