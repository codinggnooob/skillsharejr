import type { AgeGroup, PickChallenge, QuizQ, SortChallenge, ZoneId } from './types'

/* ------------------------------- MONEY ------------------------------- */
export interface MoneyContent {
  sort: SortChallenge
  budget: { income: number; fixedLabel: string; fixedCost: number; saveTarget: number; unit: string; hint: string }
  quiz: QuizQ[]
}

export const MONEY: Record<AgeGroup, MoneyContent> = {
  sprout: {
    sort: {
      title: 'Needs vs Wants',
      instruction: 'Tap each item, then tap the right basket: NEED (must have to live) or WANT (fun to have).',
      buckets: [
        { name: 'NEED', icon: '🍞', color: '#22c55e' },
        { name: 'WANT', icon: '🎮', color: '#f59e0b' },
      ],
      items: [
        { label: 'Food', icon: '🍎', bucket: 0 },
        { label: 'Toy robot', icon: '🤖', bucket: 1 },
        { label: 'Warm coat', icon: '🧥', bucket: 0 },
        { label: 'Candy', icon: '🍬', bucket: 1 },
        { label: 'School books', icon: '📚', bucket: 0 },
        { label: 'Video game', icon: '🕹️', bucket: 1 },
      ],
    },
    budget: { income: 10, fixedLabel: 'Lunch & bus', fixedCost: 4, saveTarget: 3, unit: 'coins', hint: 'Try to save at least 3 coins before spending on fun!' },
    quiz: [
      {
        q: 'You get 5 coins a week. A toy costs 20 coins. What is the smart plan?',
        options: ['Spend everything now on candy', 'Save some coins each week', 'Ask for more coins every day'],
        answer: 1,
        explain: 'Saving a little every week adds up — 5 coins a week reaches 20 in 4 weeks!',
      },
      {
        q: 'Which of these is a NEED?',
        options: ['A new game', 'Healthy food', 'A third scooter'],
        answer: 1,
        explain: 'Needs keep you safe and healthy. Wants are fun extras.',
      },
      {
        q: 'What does "saving money" mean?',
        options: ['Hiding money and forgetting it', 'Keeping some money for later', 'Spending money very fast'],
        answer: 1,
        explain: 'Saving means keeping part of your money for future goals or surprises.',
      },
    ],
  },
  explorer: {
    sort: {
      title: 'Needs vs Wants',
      instruction: 'Tap each item, then tap NEED or WANT. Some are tricky — think about what you truly can’t live without.',
      buckets: [
        { name: 'NEED', icon: '🍞', color: '#22c55e' },
        { name: 'WANT', icon: '🎮', color: '#f59e0b' },
      ],
      items: [
        { label: 'Bus pass', icon: '🚌', bucket: 0 },
        { label: 'Movie tickets', icon: '🎬', bucket: 1 },
        { label: 'Groceries', icon: '🛒', bucket: 0 },
        { label: 'Fancy headphones', icon: '🎧', bucket: 1 },
        { label: 'School supplies', icon: '✏️', bucket: 0 },
        { label: 'Game skins', icon: '👾', bucket: 1 },
        { label: 'Phone data plan', icon: '📱', bucket: 0 },
        { label: 'Fashion sneakers', icon: '👟', bucket: 1 },
      ],
    },
    budget: { income: 50, fixedLabel: 'Lunch, transport & phone', fixedCost: 25, saveTarget: 10, unit: 'coins', hint: 'A great habit: save at least 20% of any money you get.' },
    quiz: [
      {
        q: 'Your bank pays "interest" on savings. What does that mean?',
        options: ['The bank charges you for saving', 'The bank adds a little extra money to your savings over time', 'You must pay the bank every week'],
        answer: 1,
        explain: 'Interest is a reward for saving — your money slowly grows by itself.',
      },
      {
        q: 'You want a 30-coin game and have 50 coins, but no savings. What’s wisest?',
        options: ['Buy it now, worry later', 'Wait, build some savings first, then buy', 'Borrow from a friend and never pay back'],
        answer: 1,
        explain: 'Savings first means a surprise expense never becomes a crisis. The game will still be there!',
      },
      {
        q: 'What is an emergency fund for?',
        options: ['Flash sales', 'Unexpected costs like a broken phone or a doctor visit', 'Buying gifts for yourself'],
        answer: 1,
        explain: 'An emergency fund is money you don’t touch except for real surprises.',
      },
    ],
  },
  trailblazer: {
    sort: {
      title: 'Needs vs Wants',
      instruction: 'Adult edition: tap each item, then NEED or WANT. Bills count!',
      buckets: [
        { name: 'NEED', icon: '🏠', color: '#22c55e' },
        { name: 'WANT', icon: '✨', color: '#f59e0b' },
      ],
      items: [
        { label: 'Rent', icon: '🏠', bucket: 0 },
        { label: 'Streaming subscription', icon: '📺', bucket: 1 },
        { label: 'Electricity bill', icon: '💡', bucket: 0 },
        { label: 'New phone (yours works)', icon: '📱', bucket: 1 },
        { label: 'Groceries', icon: '🥦', bucket: 0 },
        { label: 'Concert tickets', icon: '🎤', bucket: 1 },
        { label: 'Health insurance', icon: '🩺', bucket: 0 },
        { label: 'Designer bag', icon: '👜', bucket: 1 },
      ],
    },
    budget: { income: 1200, fixedLabel: 'Rent, bills & food', fixedCost: 700, saveTarget: 200, unit: 'coins', hint: 'The 50/30/20 rule: ~50% needs, ~30% wants, ~20% savings.' },
    quiz: [
      {
        q: 'Compound interest means…',
        options: ['Interest only on your first deposit', 'You earn interest on your money AND on the interest it already earned', 'Interest that banks never pay'],
        answer: 1,
        explain: 'Compounding is growth on growth — starting early, even small, beats starting big later.',
      },
      {
        q: 'A credit card lets you buy now and pay later. The danger is…',
        options: ['There is no danger', 'Unpaid balances grow fast with high interest', 'Cards stop working after 10 uses'],
        answer: 1,
        explain: 'Credit card debt can grow 20%+ per year. Only charge what you can pay off monthly.',
      },
      {
        q: 'How much should an emergency fund ideally cover?',
        options: ['One pizza night', 'About 3–6 months of essential costs', 'Exactly 10 coins'],
        answer: 1,
        explain: '3–6 months of essentials means losing a job or a big bill is a bump, not a disaster.',
      },
    ],
  },
}

/* ------------------------------ DISASTER ------------------------------ */
export interface DisasterContent {
  bag: PickChallenge
  quiz: QuizQ[]
}

export const DISASTER: Record<AgeGroup, DisasterContent> = {
  sprout: {
    bag: {
      title: 'Pack the Go-Bag!',
      instruction: 'An emergency go-bag has only 6 spots. Tap the 6 items that truly help in an emergency.',
      slots: 6,
      items: [
        { label: 'Water bottles', icon: '💧', good: true, why: 'You can last days without food, but not without water.' },
        { label: 'Flashlight', icon: '🔦', good: true, why: 'Power often goes out in disasters.' },
        { label: 'First-aid kit', icon: '🩹', good: true, why: 'For cuts and scrapes when help is far away.' },
        { label: 'Whistle', icon: '📯', good: true, why: 'A whistle helps rescuers find you — louder than shouting.' },
        { label: 'Snacks', icon: '🥫', good: true, why: 'Long-lasting food keeps energy up.' },
        { label: 'Family photo & info card', icon: '🪪', good: true, why: 'Helps helpers reunite you with family.' },
        { label: 'Game console', icon: '🎮', good: false, why: 'Fun, but it won’t help in an emergency — and needs power.' },
        { label: 'Skateboard', icon: '🛹', good: false, why: 'Not useful for staying safe.' },
        { label: 'Makeup kit', icon: '💄', good: false, why: 'Looks can wait — safety first.' },
        { label: 'Comic books', icon: '💥', good: false, why: 'Heavy and not helpful in a crisis.' },
        { label: 'Candy pile', icon: '🍭', good: false, why: 'Sugar melts and doesn’t last like real snacks.' },
        { label: 'Tablet', icon: '📟', good: false, why: 'Needs charging and internet — unreliable in disasters.' },
      ],
    },
    quiz: [
      {
        q: 'The ground starts SHAKING (earthquake). What do you do first?',
        options: ['Run outside fast', 'Drop, cover under a table, hold on', 'Stand by the window to watch'],
        answer: 1,
        explain: 'Drop, Cover, Hold On! Stay away from windows and protect your head.',
      },
      {
        q: 'You smell smoke at home. What’s the right move?',
        options: ['Hide under the bed', 'Get out low (crawl under smoke) and call for help outside', 'Open all windows then keep playing'],
        answer: 1,
        explain: 'Smoke rises — crawl low, get out, stay out, and call emergency services.',
      },
      {
        q: 'A flood is coming and water is rising. Where should you go?',
        options: ['To the basement', 'To higher ground or an upper floor', 'Closer to the river to see it'],
        answer: 1,
        explain: 'Never walk or play in floodwater — go high and stay dry.',
      },
    ],
  },
  explorer: {
    bag: {
      title: 'Pack the Go-Bag!',
      instruction: '7 spots only. Pick what survival experts actually recommend for 72 hours.',
      slots: 7,
      items: [
        { label: 'Water (3L/person)', icon: '💧', good: true, why: 'One litre per person per day, minimum.' },
        { label: 'Flashlight + batteries', icon: '🔦', good: true, why: 'Candles cause fires after earthquakes — use a torch.' },
        { label: 'First-aid kit', icon: '🩹', good: true, why: 'Treat injuries before help arrives.' },
        { label: 'Whistle', icon: '📯', good: true, why: 'Three blasts is the universal distress signal.' },
        { label: 'Canned food + opener', icon: '🥫', good: true, why: 'Non-perishable food for 3 days.' },
        { label: 'Copies of ID/documents', icon: '🪪', good: true, why: 'Proves identity and helps with insurance later.' },
        { label: 'Power bank', icon: '🔋', good: true, why: 'Keeps your phone alive to reach family and alerts.' },
        { label: 'Gaming laptop', icon: '💻', good: false, why: 'Heavy, fragile, and drains fast.' },
        { label: 'Designer jacket', icon: '🧥', good: false, why: 'Warm clothes matter, fashion doesn’t.' },
        { label: 'Perfume', icon: '🧴', good: false, why: 'Zero survival value.' },
        { label: 'Board game', icon: '🎲', good: false, why: 'Comfort is nice, but space is life-critical.' },
        { label: 'Soda cans', icon: '🥤', good: false, why: 'Doesn’t hydrate like water and adds weight.' },
        { label: 'Jewellery box', icon: '💍', good: false, why: 'Valuables can be replaced — you can’t.' },
        { label: 'TV remote', icon: '📺', good: false, why: 'Not on any emergency list, ever.' },
      ],
    },
    quiz: [
      {
        q: 'A tornado warning is issued. The safest place is…',
        options: ['Next to big windows', 'A basement or small interior room on the lowest floor', 'In a car, driving fast'],
        answer: 1,
        explain: 'Low, interior, windowless. Never try to outrun a tornado in a car in traffic.',
      },
      {
        q: 'Wildfire smoke fills your town’s air. Best action?',
        options: ['Go jogging to build lung strength', 'Stay indoors, close windows, wear a mask if outside', 'Open windows to "air out" the house'],
        answer: 1,
        explain: 'Smoke particles damage lungs — seal your space and filter the air.',
      },
      {
        q: 'What should a family emergency PLAN include?',
        options: ['Just hoping nothing happens', 'A meeting spot, emergency contacts, and who does what', 'Keeping it secret from kids'],
        answer: 1,
        explain: 'Plans made in calm times save lives in chaotic ones.',
      },
    ],
  },
  trailblazer: {
    bag: {
      title: 'Pack the 72-Hour Kit',
      instruction: '7 spots. Build a kit an emergency manager would approve.',
      slots: 7,
      items: [
        { label: 'Water + purification tablets', icon: '💧', good: true, why: 'Hydration plus a backup way to make water safe.' },
        { label: 'Hand-crank radio', icon: '📻', good: true, why: 'Gets emergency broadcasts when networks fail.' },
        { label: 'First-aid kit + meds', icon: '💊', good: true, why: 'Include prescription meds for at least a week.' },
        { label: 'Whistle + dust masks', icon: '😷', good: true, why: 'Signal rescuers; masks filter debris and smoke.' },
        { label: 'High-calorie food', icon: '🥫', good: true, why: 'Dense, non-perishable calories for 3 days.' },
        { label: 'Documents + cash', icon: '💵', good: true, why: 'ATMs and card machines fail without power.' },
        { label: 'Power bank + cables', icon: '🔋', good: true, why: 'Communication is a lifeline — keep it charged.' },
        { label: 'Full wardrobe', icon: '👗', good: false, why: 'One warm layer is enough; weight matters.' },
        { label: 'Game console', icon: '🎮', good: false, why: 'Entertainment is a luxury in a survival kit.' },
        { label: 'Hair dryer', icon: '💇', good: false, why: 'No power, no point.' },
        { label: 'Coffee machine', icon: '☕', good: false, why: 'Withdrawal is bad; this is still not essential.' },
        { label: 'Decor pillows', icon: '🛋️', good: false, why: 'Comfort items stay home.' },
        { label: 'Bluetooth speaker', icon: '🔊', good: false, why: 'A radio receives information; a speaker doesn’t.' },
        { label: 'Photo frames', icon: '🖼️', good: false, why: 'Memories matter, but copies of documents matter more.' },
      ],
    },
    quiz: [
      {
        q: 'After an earthquake you see a fallen power line on a wet street. You should…',
        options: ['Step over it carefully', 'Stay far away and report it — electricity can travel through water', 'Move it with a wooden stick'],
        answer: 1,
        explain: 'Assume every downed line is live. Keep at least 10 metres away.',
      },
      {
        q: 'Someone is unconscious but breathing. Before help arrives you should…',
        options: ['Give them water', 'Place them on their side (recovery position) and monitor breathing', 'Slap them awake'],
        answer: 1,
        explain: 'The recovery position keeps airways clear. Never give an unconscious person fluids.',
      },
      {
        q: 'The best disaster strategy for a household is…',
        options: ['Reacting when it happens', 'Preparedness: kit, plan, drills, and local alert apps', 'Relying entirely on rescue services'],
        answer: 1,
        explain: 'Rescue can take 72 hours. Prepared households survive that gap comfortably.',
      },
    ],
  },
}

/* ------------------------------ ROBOTICS ------------------------------ */
export interface RoboLevel {
  w: number
  h: number
  start: { x: number; y: number; dir: number } // dir: 0=up,1=right,2=down,3=left
  goal: { x: number; y: number }
  obstacles: { x: number; y: number }[]
  maxCommands: number
}

export const ROBOTICS: Record<AgeGroup, { intro: string; levels: RoboLevel[] }> = {
  sprout: {
    intro: 'Robots only do what you tell them! Build a program with ⬆️ move, ↶ and ↷ turns, then press RUN.',
    levels: [
      { w: 5, h: 5, start: { x: 0, y: 4, dir: 1 }, goal: { x: 4, y: 2 }, obstacles: [], maxCommands: 10 },
      { w: 5, h: 5, start: { x: 0, y: 0, dir: 2 }, goal: { x: 4, y: 4 }, obstacles: [{ x: 2, y: 2 }], maxCommands: 14 },
    ],
  },
  explorer: {
    intro: 'Obstacles ahead! Robots can’t see unless you program around walls. Fewer commands = higher score.',
    levels: [
      { w: 6, h: 6, start: { x: 0, y: 5, dir: 1 }, goal: { x: 5, y: 0 }, obstacles: [{ x: 3, y: 3 }, { x: 3, y: 4 }], maxCommands: 16 },
      { w: 6, h: 6, start: { x: 0, y: 0, dir: 2 }, goal: { x: 5, y: 5 }, obstacles: [{ x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 3 }, { x: 4, y: 2 }, { x: 4, y: 3 }, { x: 4, y: 4 }], maxCommands: 18 },
      { w: 6, h: 6, start: { x: 5, y: 5, dir: 3 }, goal: { x: 0, y: 0 }, obstacles: [{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 1, y: 4 }, { x: 2, y: 4 }, { x: 3, y: 4 }], maxCommands: 18 },
    ],
  },
  trailblazer: {
    intro: 'Engineer mode: tight command limits. Think like an optimizer — the shortest program wins gold.',
    levels: [
      { w: 7, h: 7, start: { x: 0, y: 6, dir: 1 }, goal: { x: 6, y: 0 }, obstacles: [{ x: 2, y: 4 }, { x: 2, y: 5 }, { x: 4, y: 1 }, { x: 4, y: 2 }], maxCommands: 16 },
      { w: 7, h: 7, start: { x: 0, y: 0, dir: 2 }, goal: { x: 6, y: 6 }, obstacles: [{ x: 3, y: 0 }, { x: 3, y: 1 }, { x: 3, y: 2 }, { x: 3, y: 4 }, { x: 3, y: 5 }, { x: 3, y: 6 }], maxCommands: 18 },
      { w: 7, h: 7, start: { x: 6, y: 3, dir: 3 }, goal: { x: 0, y: 3 }, obstacles: [{ x: 2, y: 2 }, { x: 2, y: 3 }, { x: 2, y: 4 }, { x: 4, y: 1 }, { x: 4, y: 2 }, { x: 4, y: 4 }, { x: 4, y: 5 }], maxCommands: 16 },
    ],
  },
}

/* ------------------------------- CODING ------------------------------- */
export interface CodingContent {
  sequence: { title: string; steps: string[] }
  quiz: QuizQ[]
}

export const CODING: Record<AgeGroup, CodingContent> = {
  sprout: {
    sequence: {
      title: 'Algorithm: Brush Your Teeth!',
      steps: ['Pick up the toothbrush', 'Put toothpaste on the brush', 'Brush every tooth', 'Rinse your mouth', 'Put the brush back'],
    },
    quiz: [
      {
        q: 'A program is like a…',
        options: ['Magic wish', 'Recipe — steps in the right order', 'Random guess'],
        answer: 1,
        explain: 'Programs, like recipes, are lists of steps. Wrong order = wrong result!',
      },
      {
        q: 'Code says: REPEAT 4 TIMES { clap }. How many claps?',
        options: ['2', '4', '8'],
        answer: 1,
        explain: 'A loop repeats the steps inside it exactly the number of times you say.',
      },
      {
        q: 'Your game character walks through walls. That’s a…',
        options: ['Feature', 'Bug', 'Superpower'],
        answer: 1,
        explain: 'A bug is a mistake in code. Finding and fixing bugs is called debugging.',
      },
      {
        q: 'IF raining THEN take umbrella. It is raining. What happens?',
        options: ['Take an umbrella', 'Take sunglasses', 'Nothing'],
        answer: 0,
        explain: 'IF-THEN rules let programs make decisions — that’s called a condition.',
      },
    ],
  },
  explorer: {
    sequence: {
      title: 'Algorithm: Morning Routine',
      steps: ['Wake up alarm rings', 'Get out of bed', 'Brush teeth', 'Eat breakfast', 'Pack school bag', 'Leave for school'],
    },
    quiz: [
      {
        q: 'What does this code print?\nset count = 0\nrepeat 3 times: count = count + 2',
        options: ['3', '6', '2'],
        answer: 1,
        explain: '0+2, then 2+2, then 4+2 → 6. Loops change variables step by step.',
      },
      {
        q: 'You wrote 10 lines of code but nothing works. Best first move?',
        options: ['Delete everything', 'Read it line by line and test small parts', 'Blame the computer'],
        answer: 1,
        explain: 'Debugging = testing small pieces until you find where the output stops matching your expectation.',
      },
      {
        q: 'Why do programmers use loops?',
        options: ['To type more code', 'To repeat actions without rewriting them', 'Loops make computers faster'],
        answer: 1,
        explain: 'DRY: Don’t Repeat Yourself. One loop replaces a thousand copy-pastes.',
      },
      {
        q: 'A "variable" is…',
        options: ['A named box that stores a value', 'A broken computer part', 'A secret password'],
        answer: 0,
        explain: 'Variables store values (numbers, text) that your program can read and change.',
      },
    ],
  },
  trailblazer: {
    sequence: {
      title: 'Algorithm: How a Login Works',
      steps: ['User types username & password', 'System finds the account', 'System hashes the typed password', 'Hash is compared to the stored hash', 'Match? Grant access : Deny and count attempt', 'Too many attempts? Lock account temporarily'],
    },
    quiz: [
      {
        q: 'What does this output?\nlet x = 5\nlet y = x + 3\nx = 10\nprint(y)',
        options: ['13', '8', '10'],
        answer: 1,
        explain: 'y captured x+3 when x was 5. Changing x later doesn’t rewrite history — y stays 8.',
      },
      {
        q: 'A function is best described as…',
        options: ['A reusable named block of code with inputs and an output', 'A computer chip', 'A type of loop'],
        answer: 0,
        explain: 'Functions package logic so you can call it anywhere — like a recipe you can cook any time.',
      },
      {
        q: 'Your loop runs forever (infinite loop). Most likely cause?',
        options: ['The computer is tired', 'The loop’s exit condition can never become true', 'Too many comments'],
        answer: 1,
        explain: 'Infinite loops happen when the stop condition is never met — always trace the condition.',
      },
      {
        q: 'Why hash passwords instead of storing them as plain text?',
        options: ['It looks cooler', 'If the database leaks, attackers get hashes, not usable passwords', 'Plain text takes too much space'],
        answer: 1,
        explain: 'Hashing is one-way scrambling — a core idea in cybersecurity.',
      },
    ],
  },
}

/* --------------------------------- AI --------------------------------- */
export interface AIContent {
  train: SortChallenge
  test: { label: string; icon: string; bucket: number }[]
  quiz: QuizQ[]
}

export const AI: Record<AgeGroup, AIContent> = {
  sprout: {
    train: {
      title: 'Train Your AI!',
      instruction: 'AI learns from examples. Teach it: tap each card, then tap FRUIT or VEGETABLE to label it.',
      buckets: [
        { name: 'FRUIT', icon: '🍎', color: '#ec4899' },
        { name: 'VEGETABLE', icon: '🥕', color: '#22c55e' },
      ],
      items: [
        { label: 'Apple', icon: '🍎', bucket: 0 },
        { label: 'Carrot', icon: '🥕', bucket: 1 },
        { label: 'Banana', icon: '🍌', bucket: 0 },
        { label: 'Broccoli', icon: '🥦', bucket: 1 },
        { label: 'Grapes', icon: '🍇', bucket: 0 },
        { label: 'Potato', icon: '🥔', bucket: 1 },
        { label: 'Orange', icon: '🍊', bucket: 0 },
        { label: 'Peas', icon: '🫛', bucket: 1 },
      ],
    },
    test: [
      { label: 'Strawberry', icon: '🍓', bucket: 0 },
      { label: 'Corn', icon: '🌽', bucket: 1 },
    ],
    quiz: [
      {
        q: 'How does an AI learn to tell fruits from vegetables?',
        options: ['It reads minds', 'From many examples people show it', 'It is born knowing'],
        answer: 1,
        explain: 'AI learns patterns from examples — called training data. Just like you learned!',
      },
      {
        q: 'If you only show the AI red fruits, it might think a banana is NOT a fruit. That’s called…',
        options: ['Bias — unfair learning from one-sided examples', 'Magic', 'A feature'],
        answer: 0,
        explain: 'Biased data makes biased AI. Varied examples make fair AI.',
      },
      {
        q: 'Your AI says a tomato is a vegetable. (Scientists call it a fruit!) This shows…',
        options: ['AI is always right', 'AI can be wrong — humans must double-check', 'Tomatoes are computers'],
        answer: 1,
        explain: 'AI makes mistakes. Smart humans verify important answers.',
      },
    ],
  },
  explorer: {
    train: {
      title: 'Train a Spam Detector!',
      instruction: 'AI moderators learn from labeled messages. Tap each message, then label it SPAM or REAL.',
      buckets: [
        { name: 'SPAM', icon: '🎣', color: '#ef4444' },
        { name: 'REAL', icon: '✉️', color: '#22c55e' },
      ],
      items: [
        { label: 'WIN 1,000,000 coins NOW! Click here!!!', icon: '💰', bucket: 0 },
        { label: 'Mum: Dinner at 7, don’t be late', icon: '👩', bucket: 1 },
        { label: 'Your password expired! Verify at totally-real-bank.xyz', icon: '🔑', bucket: 0 },
        { label: 'Teacher: homework is on page 42', icon: '👩‍🏫', bucket: 1 },
        { label: 'Congratulations! You are our 1,000,000th visitor!', icon: '🎉', bucket: 0 },
        { label: 'Sam: sending you the science notes now', icon: '📓', bucket: 1 },
        { label: 'Free game coins! Just enter your login!', icon: '🎮', bucket: 0 },
        { label: 'Coach: practice moved to Saturday', icon: '⚽', bucket: 1 },
      ],
    },
    test: [
      { label: 'URGENT: account suspended, pay now!', icon: '🚨', bucket: 0 },
      { label: 'Grandma: call me when you can', icon: '👵', bucket: 1 },
    ],
    quiz: [
      {
        q: 'A spam filter learns from…',
        options: ['Guessing randomly', 'Thousands of messages humans labeled spam or real', 'The color of the screen'],
        answer: 1,
        explain: 'Machine learning finds patterns in labeled examples — urgency + prizes + links = spam signals.',
      },
      {
        q: 'If training data contains mostly English spam, the filter may miss spam in other languages. This is…',
        options: ['Perfect learning', 'A data gap leading to biased performance', 'Impossible'],
        answer: 1,
        explain: 'AI is only as good as its data. Gaps in data become blind spots.',
      },
      {
        q: 'The filter marks your teacher’s email as spam by mistake. Best takeaway?',
        options: ['Never trust email again', 'AI makes mistakes — check the spam folder and correct it', 'Email is broken'],
        answer: 1,
        explain: 'False positives happen. Human oversight keeps AI useful and fair.',
      },
    ],
  },
  trailblazer: {
    train: {
      title: 'Train a Review Authenticity Model!',
      instruction: 'Fake reviews manipulate what people buy. Label each review GENUINE or FAKE to train the model.',
      buckets: [
        { name: 'GENUINE', icon: '✅', color: '#22c55e' },
        { name: 'FAKE', icon: '🤥', color: '#ef4444' },
      ],
      items: [
        { label: '★★★★☆ Good camera, battery dies fast. Using it 3 months.', icon: '📷', bucket: 0 },
        { label: '★★★★★ BEST PRODUCT EVER!!! BUY NOW!!! PERFECT!!!', icon: '❗', bucket: 1 },
        { label: '★★★☆☆ Works, but the app crashes weekly. Support was slow.', icon: '🐞', bucket: 0 },
        { label: '★★★★★ Amazing amazing amazing. Five stars. Amazing.', icon: '🔁', bucket: 1 },
        { label: '★★☆☆☆ Arrived broken, refund took 2 weeks. Photos attached.', icon: '📦', bucket: 0 },
        { label: '★★★★★ I bought 12 for my whole family! (posted 40 times today)', icon: '🤖', bucket: 1 },
        { label: '★★★★☆ Great for beginners, pros will want more features.', icon: '🧭', bucket: 0 },
        { label: '★★★★★ Changed my life!!! (account created yesterday, 60 reviews)', icon: '🎭', bucket: 1 },
      ],
    },
    test: [
      { label: '★★★★★ PERFECT!!! No flaws! Everyone must buy!!!', icon: '📣', bucket: 1 },
      { label: '★★★☆☆ Decent value, but sizing runs small. Kept it anyway.', icon: '📏', bucket: 0 },
    ],
    quiz: [
      {
        q: 'The model learns fake reviews use extreme words, repetition, and burst posting. This is called…',
        options: ['Feature patterns — signals the model weighs', 'Luck', 'Mind reading'],
        answer: 0,
        explain: 'ML models weigh features (word choice, timing, account age) to make predictions.',
      },
      {
        q: 'If sellers start writing calmer fake reviews, the model will fail until…',
        options: ['Forever — AI can’t adapt', 'It’s retrained on new examples of the new fakes', 'Reviews are banned'],
        answer: 1,
        explain: 'AI systems drift and must be retrained — the arms race between fakers and detectors never ends.',
      },
      {
        q: 'A model trained only on product reviews is asked to grade essays. What happens?',
        options: ['It works perfectly', 'It performs poorly — models don’t generalize beyond their training domain', 'It becomes sentient'],
        answer: 1,
        explain: 'AI is narrow: it knows its training domain and fails confidently outside it. Always question scope.',
      },
    ],
  },
}

/* --------------------------- MEDIA / THINKING --------------------------- */
export const MEDIA: Record<AgeGroup, SortChallenge> = {
  sprout: {
    title: 'Fact, Opinion, or Trick?',
    instruction: 'Read each card. Is it a FACT (can be checked), an OPINION (a feeling), or a TRICK (trying to fool you)?',
    buckets: [
      { name: 'FACT', icon: '✅', color: '#22c55e' },
      { name: 'OPINION', icon: '💭', color: '#3b82f6' },
      { name: 'TRICK', icon: '🎣', color: '#ef4444' },
    ],
    items: [
      { label: 'Water boils when it gets very hot.', icon: '💧', bucket: 0 },
      { label: 'Blue is the best color ever.', icon: '💙', bucket: 1 },
      { label: 'You WON a prize! Send your address to claim it!', icon: '🎁', bucket: 2 },
      { label: 'The Earth goes around the Sun.', icon: '🌍', bucket: 0 },
      { label: 'Vegetables taste yucky.', icon: '🥦', bucket: 1 },
      { label: 'Click here for free coins — tell no one!', icon: '🪙', bucket: 2 },
    ],
  },
  explorer: {
    title: 'Fact, Opinion, or Trick?',
    instruction: 'Social media edition. Sort each post: FACT (verifiable), OPINION (a view), or TRICK (scam/manipulation).',
    buckets: [
      { name: 'FACT', icon: '✅', color: '#22c55e' },
      { name: 'OPINION', icon: '💭', color: '#3b82f6' },
      { name: 'TRICK', icon: '🎣', color: '#ef4444' },
    ],
    items: [
      { label: 'Our school was built in 1985, says the town archive.', icon: '🏫', bucket: 0 },
      { label: 'Everyone knows this song is the worst.', icon: '🎵', bucket: 1 },
      { label: 'DM me your password and I’ll make you famous!', icon: '🌟', bucket: 2 },
      { label: 'The match ended 2-1, reports the league’s official site.', icon: '⚽', bucket: 0 },
      { label: 'If you don’t share this in 10 seconds you’re a bad friend.', icon: '⛓️', bucket: 2 },
      { label: 'Pineapple on pizza is a crime against food.', icon: '🍍', bucket: 1 },
      { label: 'Doctors HATE this trick! Lose 10kg in a day!', icon: '💊', bucket: 2 },
      { label: 'Study: teens need 8–10 hours of sleep, says the health ministry.', icon: '😴', bucket: 0 },
    ],
  },
  trailblazer: {
    title: 'Fact, Opinion, or Manipulation?',
    instruction: 'Adult-internet mode: sort each into FACT (verifiable source), OPINION (arguable view), or MANIPULATION (scam, rage-bait, or misinformation).',
    buckets: [
      { name: 'FACT', icon: '✅', color: '#22c55e' },
      { name: 'OPINION', icon: '💭', color: '#3b82f6' },
      { name: 'MANIPULATION', icon: '🎣', color: '#ef4444' },
    ],
    items: [
      { label: 'Unemployment fell to 4.1% in Q2, per the national statistics office.', icon: '📊', bucket: 0 },
      { label: 'This politician is destroying the country — repost if you agree!', icon: '🔥', bucket: 2 },
      { label: 'In my view, remote work beats the office for deep focus.', icon: '💻', bucket: 1 },
      { label: 'URGENT: your parcel is held. Pay 2.99 "customs fee" here.', icon: '📦', bucket: 2 },
      { label: 'The vaccine trial enrolled 40,000 participants; results published in a peer-reviewed journal.', icon: '🧪', bucket: 0 },
      { label: 'They don’t want you to know this one secret about banks…', icon: '🤫', bucket: 2 },
      { label: 'Honestly, the sequel was better than the original.', icon: '🎬', bucket: 1 },
      { label: 'A shocking video with no source, date, or location goes viral during a crisis.', icon: '📹', bucket: 2 },
    ],
  },
}

/* ------------------------------- WELLNESS ------------------------------- */
export interface WellnessContent {
  plate: PickChallenge
  quiz: QuizQ[]
}

export const WELLNESS: Record<AgeGroup, WellnessContent> = {
  sprout: {
    plate: {
      title: 'Build a Power Plate!',
      instruction: 'Pick 5 items that give your body superpowers: fruits/veggies, protein, grains, and water. Choose wisely!',
      slots: 5,
      items: [
        { label: 'Apple', icon: '🍎', good: true, why: 'Fruits give vitamins and fiber.' },
        { label: 'Carrots', icon: '🥕', good: true, why: 'Veggies help eyes and skin.' },
        { label: 'Chicken & beans', icon: '🍗', good: true, why: 'Protein builds strong muscles.' },
        { label: 'Brown rice', icon: '🍚', good: true, why: 'Grains give long-lasting energy.' },
        { label: 'Water', icon: '💧', good: true, why: 'Your body is mostly water — refill it!' },
        { label: 'Soda', icon: '🥤', good: false, why: 'Sugar rush, then crash. Water wins.' },
        { label: 'Candy bars', icon: '🍫', good: false, why: 'A sometimes-treat, not fuel.' },
        { label: 'Chips', icon: '🍟', good: false, why: 'Salty snacks don’t power your body.' },
        { label: 'Energy drink', icon: '⚡', good: false, why: 'Not made for growing bodies.' },
        { label: 'Ice cream mountain', icon: '🍨', good: false, why: 'Delicious — but a dessert, not a meal.' },
      ],
    },
    quiz: [
      {
        q: 'Your friend fell and is crying. What’s a kind thing to do?',
        options: ['Laugh — it looks funny', 'Ask if they’re okay and get a grown-up', 'Run away'],
        answer: 1,
        explain: 'Empathy means noticing others’ feelings and helping.',
      },
      {
        q: 'You feel very angry. What helps MOST?',
        options: ['Breaking things', 'Slow breaths, name the feeling, then talk about it', 'Keeping it inside forever'],
        answer: 1,
        explain: 'All feelings are okay. Naming and breathing calms your brain’s alarm system.',
      },
      {
        q: 'Sleep is important because…',
        options: ['It isn’t', 'Your brain and body grow and repair while you sleep', 'It makes the night shorter'],
        answer: 1,
        explain: 'Kids need 9–12 hours. Sleep is when learning gets saved!',
      },
    ],
  },
  explorer: {
    plate: {
      title: 'Build a Power Plate!',
      instruction: 'Pick 5: aim for 2 plants, a protein, a whole grain, and water. Your future self says thanks.',
      slots: 5,
      items: [
        { label: 'Salad bowl', icon: '🥗', good: true, why: 'Half your plate should be plants.' },
        { label: 'Banana', icon: '🍌', good: true, why: 'Great pre-sport fuel.' },
        { label: 'Eggs & lentils', icon: '🍳', good: true, why: 'Protein keeps you full and focused.' },
        { label: 'Whole-grain pasta', icon: '🍝', good: true, why: 'Steady energy for brain and body.' },
        { label: 'Water', icon: '💧', good: true, why: 'Even mild dehydration hurts concentration.' },
        { label: 'Double burger + large fries', icon: '🍔', good: false, why: 'Fine occasionally — not daily fuel.' },
        { label: 'Energy drink', icon: '⚡', good: false, why: 'Caffeine + sugar harms teen sleep and hearts.' },
        { label: 'Candy', icon: '🍬', good: false, why: 'Quick spike, quick crash.' },
        { label: 'Instant noodles (daily)', icon: '🍜', good: false, why: 'Low nutrients, very high salt.' },
        { label: 'Donuts', icon: '🍩', good: false, why: 'A treat, not a building block.' },
      ],
    },
    quiz: [
      {
        q: 'You feel stressed before a big test. What actually helps?',
        options: ['All-nighter with energy drinks', 'Sleep, short study chunks, and slow breathing before the test', 'Scrolling to forget about it'],
        answer: 1,
        explain: 'Sleep consolidates memory. Cramming tired beats nothing.',
      },
      {
        q: 'A friend seems sad and quiet for days. The best move is…',
        options: ['Ignore it — not your problem', 'Check in privately, listen, and suggest talking to a trusted adult if it continues', 'Post about it online'],
        answer: 1,
        explain: 'Checking in can change someone’s week. Heavy feelings deserve real support.',
      },
      {
        q: 'Healthy screen habits look like…',
        options: ['Phone until 2am', 'Screens off ~1 hour before sleep, breaks every hour', 'No rules, vibes only'],
        answer: 1,
        explain: 'Blue light and doomscrolling steal sleep. Boundaries = better mood and grades.',
      },
    ],
  },
  trailblazer: {
    plate: {
      title: 'Build a Performance Plate',
      instruction: 'Pick 5 that a nutritionist would approve for an exam week: plants, protein, complex carbs, hydration.',
      slots: 5,
      items: [
        { label: 'Leafy greens & veg', icon: '🥦', good: true, why: 'Micronutrients power focus and immunity.' },
        { label: 'Berries & fruit', icon: '🫐', good: true, why: 'Antioxidants + natural sugars, steady release.' },
        { label: 'Fish / tofu & beans', icon: '🐟', good: true, why: 'Protein + omega-3s support memory.' },
        { label: 'Oats & whole grains', icon: '🌾', good: true, why: 'Complex carbs = stable blood sugar, stable mood.' },
        { label: 'Water', icon: '💧', good: true, why: '2% dehydration measurably reduces cognition.' },
        { label: 'Energy drink stack', icon: '⚡', good: false, why: 'Crashes, anxiety, ruined sleep — net negative.' },
        { label: 'Fast food combo (daily)', icon: '🍟', good: false, why: 'Ultra-processed diets correlate with low mood.' },
        { label: 'Skipping meals', icon: '🚫', good: false, why: 'Your brain runs on glucose — feed it.' },
        { label: 'Candy breakfast', icon: '🍭', good: false, why: 'Spike and crash by 10am.' },
        { label: 'Mega latte x4', icon: '☕', good: false, why: 'Caffeine dependence masks sleep debt.' },
      ],
    },
    quiz: [
      {
        q: 'Friends pressure you to skip study and party before finals. A strong response is…',
        options: ['Go along — FOMO wins', 'A confident "no" plus an alternative plan after exams', 'Ghost everyone forever'],
        answer: 1,
        explain: 'Real confidence = holding your boundary without burning the friendship.',
      },
      {
        q: 'Persistent sadness or anxiety for weeks should be treated like…',
        options: ['A weakness to hide', 'A health issue — talk to a counselor/doctor, like you would for a broken arm', 'Something sleep fixes'],
        answer: 1,
        explain: 'Mental health is health. Early help works; suffering in silence doesn’t.',
      },
      {
        q: 'The most underrated performance habit is…',
        options: ['More caffeine', 'Consistent sleep, movement, and real meals', 'Motivational videos'],
        answer: 1,
        explain: 'Sleep, exercise and nutrition outperform any hack. Boring, free, effective.',
      },
    ],
  },
}

/* --------------------------------- TIME -------------------------------- */
export const TIME: Record<AgeGroup, SortChallenge> = {
  sprout: {
    title: 'What First, What Later?',
    instruction: 'Your day is a puzzle! Tap each task, then sort it: DO FIRST, LATER, or SKIP.',
    buckets: [
      { name: 'DO FIRST', icon: '🔥', color: '#ef4444' },
      { name: 'LATER', icon: '🕐', color: '#f59e0b' },
      { name: 'SKIP', icon: '🚫', color: '#64748b' },
    ],
    items: [
      { label: 'Homework due tomorrow', icon: '📚', bucket: 0 },
      { label: 'Feed your hungry pet', icon: '🐶', bucket: 0 },
      { label: 'Birthday card for gran — party is next month', icon: '💌', bucket: 1 },
      { label: 'Practice football — game is Saturday', icon: '⚽', bucket: 1 },
      { label: 'Watch "just one more" video at bedtime', icon: '📱', bucket: 2 },
      { label: 'Reorganize your sock drawer at midnight', icon: '🧦', bucket: 2 },
      { label: 'Pack your school bag for tomorrow', icon: '🎒', bucket: 0 },
      { label: 'Learn to juggle — someday maybe', icon: '🤹', bucket: 1 },
    ],
  },
  explorer: {
    title: 'Prioritize Like a Pro',
    instruction: 'Urgent + important goes first. Tap each task, then sort: DO FIRST, LATER, or SKIP.',
    buckets: [
      { name: 'DO FIRST', icon: '🔥', color: '#ef4444' },
      { name: 'LATER', icon: '🕐', color: '#f59e0b' },
      { name: 'SKIP', icon: '🚫', color: '#64748b' },
    ],
    items: [
      { label: 'Science project due tomorrow (not started)', icon: '🧪', bucket: 0 },
      { label: 'Reply to your best friend who is upset', icon: '💬', bucket: 0 },
      { label: 'Sign-up for art club — deadline next week', icon: '🎨', bucket: 1 },
      { label: 'Start revising — exam in two weeks', icon: '📖', bucket: 1 },
      { label: '3-hour "quick" gaming session before the project', icon: '🎮', bucket: 2 },
      { label: 'Argue in a comment thread with a stranger', icon: '⌨️', bucket: 2 },
      { label: 'Fix your bike brakes — you ride daily', icon: '🚲', bucket: 0 },
      { label: 'Plan the summer reading list', icon: '🏖️', bucket: 1 },
    ],
  },
  trailblazer: {
    title: 'Eisenhower Bootcamp',
    instruction: 'Adult priorities: urgent + important first, important-not-urgent scheduled, time-sinks skipped.',
    buckets: [
      { name: 'DO FIRST', icon: '🔥', color: '#ef4444' },
      { name: 'LATER', icon: '🕐', color: '#f59e0b' },
      { name: 'SKIP', icon: '🚫', color: '#64748b' },
    ],
    items: [
      { label: 'Scholarship application — deadline tonight', icon: '🎓', bucket: 0 },
      { label: 'Doctor appointment you’ve postponed twice — chest pain', icon: '🩺', bucket: 0 },
      { label: 'Build an emergency fund habit (auto-transfer)', icon: '💰', bucket: 1 },
      { label: 'Learn a skill for the job you want in 2 years', icon: '🛠️', bucket: 1 },
      { label: 'Doomscroll for "five minutes"', icon: '📱', bucket: 2 },
      { label: 'Rewrite your CV for the 9th time instead of sending it', icon: '📄', bucket: 2 },
      { label: 'Call grandma back — she left 3 messages', icon: '👵', bucket: 0 },
      { label: 'Weekly review: plan next week’s top 3 goals', icon: '🗓️', bucket: 1 },
    ],
  },
}

/* --------------------------------- GREEN -------------------------------- */
export const GREEN: Record<AgeGroup, SortChallenge> = {
  sprout: {
    title: 'Sort It Right!',
    instruction: 'Keep Earth clean! Tap each item, then sort: RECYCLE, COMPOST, or TRASH.',
    buckets: [
      { name: 'RECYCLE', icon: '♻️', color: '#3b82f6' },
      { name: 'COMPOST', icon: '🌱', color: '#22c55e' },
      { name: 'TRASH', icon: '🗑️', color: '#64748b' },
    ],
    items: [
      { label: 'Empty plastic bottle', icon: '🧴', bucket: 0 },
      { label: 'Apple core', icon: '🍎', bucket: 1 },
      { label: 'Clean cardboard box', icon: '📦', bucket: 0 },
      { label: 'Banana peel', icon: '🍌', bucket: 1 },
      { label: 'Broken crayons', icon: '🖍️', bucket: 2 },
      { label: 'Glass jar (rinsed)', icon: '🫙', bucket: 0 },
      { label: 'Used tissues', icon: '🤧', bucket: 2 },
      { label: 'Eggshells', icon: '🥚', bucket: 1 },
    ],
  },
  explorer: {
    title: 'Sort It Right!',
    instruction: 'Trickier edition. RECYCLE (clean & recyclable), COMPOST (food/natural), TRASH (the rest).',
    buckets: [
      { name: 'RECYCLE', icon: '♻️', color: '#3b82f6' },
      { name: 'COMPOST', icon: '🌱', color: '#22c55e' },
      { name: 'TRASH', icon: '🗑️', color: '#64748b' },
    ],
    items: [
      { label: 'Aluminum can', icon: '🥫', bucket: 0 },
      { label: 'Leftover rice', icon: '🍚', bucket: 1 },
      { label: 'Greasy pizza box', icon: '🍕', bucket: 2 },
      { label: 'Newspaper', icon: '📰', bucket: 0 },
      { label: 'Coffee grounds', icon: '☕', bucket: 1 },
      { label: 'Crisp packet (foil-lined)', icon: '🍟', bucket: 2 },
      { label: 'Rinsed milk jug', icon: '🥛', bucket: 0 },
      { label: 'Fallen leaves', icon: '🍂', bucket: 1 },
    ],
  },
  trailblazer: {
    title: 'Sort It Right: Expert Mode',
    instruction: 'Wishcycling (recycling wrong things) ruins whole batches. RECYCLE, COMPOST, or TRASH — be precise.',
    buckets: [
      { name: 'RECYCLE', icon: '♻️', color: '#3b82f6' },
      { name: 'COMPOST', icon: '🌱', color: '#22c55e' },
      { name: 'TRASH', icon: '🗑️', color: '#64748b' },
    ],
    items: [
      { label: 'Clean tin can, label off', icon: '🥫', bucket: 0 },
      { label: 'Veggie scraps & peels', icon: '🥬', bucket: 1 },
      { label: 'Plastic bag / film wrap', icon: '🛍️', bucket: 2 },
      { label: 'Office paper', icon: '📄', bucket: 0 },
      { label: 'Tea bags (plastic-free)', icon: '🍵', bucket: 1 },
      { label: 'Styrofoam packaging', icon: '📦', bucket: 2 },
      { label: 'Rinsed yogurt pot', icon: '🍶', bucket: 0 },
      { label: 'Garden cuttings', icon: '🌿', bucket: 1 },
    ],
  },
}

/* --------------------------- registry & helpers --------------------------- */
export const GREEN_QUIZ: Record<AgeGroup, QuizQ[]> = {
  sprout: [
    {
      q: 'Leaving a room — what should you do with the light?',
      options: ['Leave it on forever', 'Turn it off to save energy', 'Turn it up brighter'],
      answer: 1,
      explain: 'Small habits save energy — and saving energy helps the planet.',
    },
  ],
  explorer: [
    {
      q: 'Which everyday choice helps the planet MOST?',
      options: ['Buying new stuff weekly', 'Using things longer, refilling, and wasting less food', 'Double-bagging everything'],
      answer: 1,
      explain: 'Reduce > Reuse > Recycle. Not buying beats recycling.',
    },
  ],
  trailblazer: [
    {
      q: '"Wishcycling" — tossing doubtful items in recycling — causes…',
      options: ['Extra-good recycling', 'Contamination that can send whole batches to landfill', 'Nothing at all'],
      answer: 1,
      explain: 'One greasy or non-recyclable item can spoil a whole truckload. When in doubt, check local rules.',
    },
  ],
}

export type GameContent =
  | { kind: 'money'; data: MoneyContent }
  | { kind: 'disaster'; data: DisasterContent }
  | { kind: 'robotics'; data: { intro: string; levels: RoboLevel[] } }
  | { kind: 'coding'; data: CodingContent }
  | { kind: 'ai'; data: AIContent }
  | { kind: 'sort'; data: SortChallenge; quiz: QuizQ[] }
  | { kind: 'wellness'; data: WellnessContent }

export function getZoneContent(zone: ZoneId, age: AgeGroup): GameContent {
  switch (zone) {
    case 'bank': return { kind: 'money', data: MONEY[age] }
    case 'safety': return { kind: 'disaster', data: DISASTER[age] }
    case 'robo': return { kind: 'robotics', data: ROBOTICS[age] }
    case 'code': return { kind: 'coding', data: CODING[age] }
    case 'ai': return { kind: 'ai', data: AI[age] }
    case 'media': return { kind: 'sort', data: MEDIA[age], quiz: MEDIA_QUIZ[age] }
    case 'wellness': return { kind: 'wellness', data: WELLNESS[age] }
    case 'time': return { kind: 'sort', data: TIME[age], quiz: TIME_QUIZ[age] }
    case 'green': return { kind: 'sort', data: GREEN[age], quiz: GREEN_QUIZ[age] }
  }
}

const MEDIA_QUIZ: Record<AgeGroup, QuizQ[]> = {
  sprout: [
    {
      q: 'Before sharing a surprising video, you should…',
      options: ['Share it super fast', 'Check: who made it? Is it true?', 'Add more shock to it'],
      answer: 1,
      explain: 'Smart sharers check the source first.',
    },
  ],
  explorer: [
    {
      q: 'A post makes you VERY angry instantly. That’s often a sign of…',
      options: ['Great journalism', 'Rage-bait designed to farm your clicks', 'Your phone overheating'],
      answer: 1,
      explain: 'Extreme emotion = engagement = money for someone. Pause before reacting.',
    },
  ],
  trailblazer: [
    {
      q: 'The strongest way to verify a viral claim is…',
      options: ['Check if it has many likes', 'Find the original source and cross-check with independent reputable outlets', 'Ask the comments section'],
      answer: 1,
      explain: 'Popularity isn’t proof. Lateral reading — checking other sources — is the pro move.',
    },
  ],
}

const TIME_QUIZ: Record<AgeGroup, QuizQ[]> = {
  sprout: [
    {
      q: 'A big task feels scary. What makes it easier?',
      options: ['Never starting', 'Breaking it into small steps', 'Crying about it'],
      answer: 1,
      explain: 'Small steps turn mountains into staircases.',
    },
  ],
  explorer: [
    {
      q: 'The best time to start studying for an exam in 2 weeks is…',
      options: ['The night before', 'Today, in small daily chunks', 'After the exam'],
      answer: 1,
      explain: 'Spaced practice beats cramming — your brain needs repeats over days.',
    },
  ],
  trailblazer: [
    {
      q: 'Your calendar is full but nothing important moves. The fix is…',
      options: ['Add more hours to the day', 'Say no to low-value tasks and time-block your top priorities', 'Multitask everything'],
      answer: 1,
      explain: 'Time management is really priority management. Protect blocks for what matters.',
    },
  ],
}
