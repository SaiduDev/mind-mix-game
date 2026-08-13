/**
 * Spelling Packing Game - 210 levels with progressive difficulty
 */

const SpellingGame = (() => {
  const STORAGE_KEYS = {
    currentLevel: 'currentLevel',
    totalScore: 'totalScore',
    levelsCompleted: 'levelsCompleted',
    completedLevels: 'completedLevels',
  };

  // Word database organized by difficulty tier
  const WORD_TIERS = {
    easy: {
      words: [
        { word: 'CAT', hint: 'A furry pet that meows' },
        { word: 'DOG', hint: 'Man\'s best friend' },
        { word: 'SUN', hint: 'Bright star in our sky' },
        { word: 'HAT', hint: 'Worn on your head' },
        { word: 'CUP', hint: 'Used to drink from' },
        { word: 'PEN', hint: 'Used for writing' },
        { word: 'BOX', hint: 'Container for storage' },
        { word: 'RUN', hint: 'Move quickly on foot' },
        { word: 'BIG', hint: 'Opposite of small' },
        { word: 'RED', hint: 'Color of a rose' },
        { word: 'TOP', hint: 'Highest point' },
        { word: 'BED', hint: 'Where you sleep' },
        { word: 'EGG', hint: 'Comes from a chicken' },
        { word: 'FAN', hint: 'Keeps you cool' },
        { word: 'JAM', hint: 'Sweet spread for toast' },
        { word: 'KEY', hint: 'Opens a lock' },
        { word: 'MAP', hint: 'Shows directions' },
        { word: 'NET', hint: 'Used to catch fish' },
        { word: 'OWL', hint: 'Wise night bird' },
        { word: 'PIG', hint: 'Pink farm animal' },
        { word: 'RAT', hint: 'Small rodent' },
        { word: 'SKY', hint: 'Above the clouds' },
        { word: 'TOY', hint: 'Something to play with' },
        { word: 'VAN', hint: 'Large vehicle' },
        { word: 'WEB', hint: 'Spider makes this' },
        { word: 'ZOO', hint: 'Place with animals' },
        { word: 'ANT', hint: 'Tiny hardworking insect' },
        { word: 'BUS', hint: 'Public transport vehicle' },
        { word: 'COW', hint: 'Gives us milk' },
        { word: 'FOX', hint: 'Clever wild animal' },
        { word: 'GEM', hint: 'Precious stone' },
        { word: 'HOT', hint: 'Opposite of cold' },
        { word: 'ICE', hint: 'Frozen water' },
        { word: 'JAR', hint: 'Glass container' },
        { word: 'LOG', hint: 'Cut piece of tree' },
        { word: 'MUD', hint: 'Wet dirt' },
        { word: 'NUT', hint: 'Squirrel loves these' },
        { word: 'OAK', hint: 'Strong tree type' },
        { word: 'POT', hint: 'Used for cooking' },
        { word: 'RUG', hint: 'Floor covering' },
        { word: 'SEA', hint: 'Large body of salt water' },
        { word: 'TEA', hint: 'Hot beverage' },
        { word: 'URN', hint: 'Decorative vase' },
        { word: 'WAX', hint: 'Used to make candles' },
        { word: 'YAK', hint: 'Hairy mountain animal' },
        { word: 'ZIP', hint: 'Fastener on clothes' },
        { word: 'ARM', hint: 'Body part from shoulder to hand' },
        { word: 'BAG', hint: 'Carry things in this' },
        { word: 'CAN', hint: 'Metal container' },
        { word: 'DIP', hint: 'Lower briefly into liquid' },
        { word: 'EAT', hint: 'Consume food' },
        { word: 'FUN', hint: 'Enjoyable activity' },
        { word: 'GAP', hint: 'Space between things' },
      ],
    },
    medium: {
      words: [
        { word: 'APPLE', hint: 'Red or green fruit' },
        { word: 'BREAD', hint: 'Baked food made from flour' },
        { word: 'CHAIR', hint: 'Furniture to sit on' },
        { word: 'DANCE', hint: 'Move to music rhythmically' },
        { word: 'EARTH', hint: 'Planet we live on' },
        { word: 'FLAME', hint: 'Hot glowing fire' },
        { word: 'GRAPE', hint: 'Small round fruit in bunches' },
        { word: 'HEART', hint: 'Pumps blood in your body' },
        { word: 'IMAGE', hint: 'Visual representation' },
        { word: 'JUICE', hint: 'Drink from fruits' },
        { word: 'KNIFE', hint: 'Sharp cutting tool' },
        { word: 'LEMON', hint: 'Sour yellow citrus fruit' },
        { word: 'MUSIC', hint: 'Organized sounds and melodies' },
        { word: 'NIGHT', hint: 'Time when it is dark' },
        { word: 'OCEAN', hint: 'Vast body of salt water' },
        { word: 'PIANO', hint: 'Musical instrument with keys' },
        { word: 'QUEEN', hint: 'Female ruler of a kingdom' },
        { word: 'RIVER', hint: 'Flowing body of fresh water' },
        { word: 'SMILE', hint: 'Happy facial expression' },
        { word: 'TABLE', hint: 'Flat surface with legs' },
        { word: 'UNITY', hint: 'State of being together' },
        { word: 'VOICE', hint: 'Sound from your mouth' },
        { word: 'WATER', hint: 'Clear liquid essential for life' },
        { word: 'YOUTH', hint: 'Time of being young' },
        { word: 'ZEBRA', hint: 'Striped African animal' },
        { word: 'BRAVE', hint: 'Showing courage' },
        { word: 'CLOUD', hint: 'White mass in the sky' },
        { word: 'DREAM', hint: 'Images while sleeping' },
        { word: 'EAGLE', hint: 'Large bird of prey' },
        { word: 'FROST', hint: 'Thin ice on surfaces' },
        { word: 'GHOST', hint: 'Spirit of the dead' },
        { word: 'HORSE', hint: 'Animal you can ride' },
        { word: 'IVORY', hint: 'Material from elephant tusks' },
        { word: 'JOLLY', hint: 'Full of cheerfulness' },
        { word: 'KNEEL', hint: 'Rest on your knees' },
        { word: 'LIGHT', hint: 'Makes things visible' },
        { word: 'MOUSE', hint: 'Small rodent or computer device' },
        { word: 'NORTH', hint: 'Direction toward the pole' },
        { word: 'OLIVE', hint: 'Small green Mediterranean fruit' },
        { word: 'PEACE', hint: 'Freedom from war' },
        { word: 'QUILT', hint: 'Bed cover made of patches' },
        { word: 'ROBOT', hint: 'Automated machine' },
        { word: 'SHARK', hint: 'Large ocean predator' },
        { word: 'TIGER', hint: 'Striped big cat' },
        { word: 'ULTRA', hint: 'Beyond the normal range' },
        { word: 'VIVID', hint: 'Intensely bright or clear' },
        { word: 'WHALE', hint: 'Largest ocean mammal' },
        { word: 'XENON', hint: 'Noble gas element' },
        { word: 'YACHT', hint: 'Luxury boat' },
        { word: 'ZESTY', hint: 'Full of flavor and energy' },
        { word: 'ALERT', hint: 'Quick to notice things' },
        { word: 'BLEND', hint: 'Mix together smoothly' },
        { word: 'CRANE', hint: 'Tall bird or lifting machine' },
        { word: 'DRAIN', hint: 'Remove liquid from' },
        { word: 'ELBOW', hint: 'Joint in middle of arm' },
        { word: 'FENCE', hint: 'Boundary around a yard' },
        { word: 'GLOBE', hint: 'Spherical model of Earth' },
        { word: 'HUMOR', hint: 'Quality of being amusing' },
        { word: 'INBOX', hint: 'Where emails arrive' },
        { word: 'JUMBO', hint: 'Extra large size' },
      ],
    },
    hard: {
      words: [
        { word: 'BALANCE', hint: 'Even distribution of weight' },
        { word: 'CAPTAIN', hint: 'Leader of a ship or team' },
        { word: 'DIAMOND', hint: 'Precious sparkling gem' },
        { word: 'ELEMENT', hint: 'Basic substance in chemistry' },
        { word: 'FACTORY', hint: 'Building where goods are made' },
        { word: 'GALLERY', hint: 'Room for displaying art' },
        { word: 'HARMONY', hint: 'Pleasant combination of sounds' },
        { word: 'INSIGHT', hint: 'Deep understanding' },
        { word: 'JOURNEY', hint: 'Long trip from one place to another' },
        { word: 'KITCHEN', hint: 'Room for preparing food' },
        { word: 'LIBRARY', hint: 'Place full of books' },
        { word: 'MYSTERY', hint: 'Something difficult to explain' },
        { word: 'NETWORK', hint: 'Connected system of things' },
        { word: 'OPTICAL', hint: 'Related to vision or light' },
        { word: 'PACKAGE', hint: 'Wrapped bundle for delivery' },
        { word: 'QUALITY', hint: 'Standard of excellence' },
        { word: 'RAINBOW', hint: 'Arc of colors after rain' },
        { word: 'SCIENCE', hint: 'Study of the natural world' },
        { word: 'THUNDER', hint: 'Loud sound after lightning' },
        { word: 'UNIFORM', hint: 'Standard clothing for a group' },
        { word: 'VICTORY', hint: 'Winning a contest or battle' },
        { word: 'WILDLIFE', hint: 'Animals living in nature' },
        { word: 'ABSOLUTE', hint: 'Complete and total' },
        { word: 'BROTHER', hint: 'Male sibling' },
        { word: 'CULTURE', hint: 'Customs of a society' },
        { word: 'DYNAMIC', hint: 'Full of energy and change' },
        { word: 'EXPLORE', hint: 'Travel to discover new places' },
        { word: 'FREEDOM', hint: 'Power to act without restraint' },
        { word: 'GENUINE', hint: 'Real and authentic' },
        { word: 'HISTORY', hint: 'Study of past events' },
        { word: 'IMAGINE', hint: 'Form a mental picture' },
        { word: 'JUSTICE', hint: 'Fair treatment under law' },
        { word: 'KINGDOM', hint: 'Territory ruled by a king' },
        { word: 'LANTERN', hint: 'Portable light source' },
        { word: 'MACHINE', hint: 'Device with moving parts' },
        { word: 'NATURAL', hint: 'Existing in nature' },
        { word: 'OUTDOOR', hint: 'Done outside a building' },
        { word: 'PATTERN', hint: 'Repeated decorative design' },
        { word: 'QUARTER', hint: 'One fourth of something' },
        { word: 'RESCUED', hint: 'Saved from danger' },
        { word: 'SHELTER', hint: 'Place giving protection' },
        { word: 'TREASURE', hint: 'Collection of valuable items' },
        { word: 'UNIQUE', hint: 'One of a kind' },
        { word: 'VILLAGE', hint: 'Small rural community' },
        { word: 'WONDER', hint: 'Feeling of amazement' },
        { word: 'ANCIENT', hint: 'Very old, from long ago' },
        { word: 'BENEATH', hint: 'Directly under something' },
        { word: 'CIRCUS', hint: 'Show with acrobats and clowns' },
        { word: 'DELIGHT', hint: 'Great pleasure and joy' },
        { word: 'EMBRACE', hint: 'Hold closely in arms' },
        { word: 'FANTASY', hint: 'Imaginative fiction' },
        { word: 'GLIMPSE', hint: 'Brief quick look' },
        { word: 'HORIZON', hint: 'Line where sky meets land' },
        { word: 'INSECTS', hint: 'Six-legged creatures' },
        { word: 'JUSTIFY', hint: 'Show to be right or reasonable' },
        { word: 'KINETIC', hint: 'Related to motion energy' },
        { word: 'LUNATIC', hint: 'Wildly foolish person' },
        { word: 'MOMENT', hint: 'Very brief period of time' },
        { word: 'NOTABLE', hint: 'Worthy of attention' },
      ],
    },
    expert: {
      words: [
        { word: 'BEAUTIFUL', hint: 'Pleasing to the senses' },
        { word: 'CHALLENGE', hint: 'Difficult task to overcome' },
        { word: 'DANGEROUS', hint: 'Likely to cause harm' },
        { word: 'ELECTRIC', hint: 'Powered by electricity' },
        { word: 'FANTASTIC', hint: 'Extraordinarily good' },
        { word: 'GENERATOR', hint: 'Machine that produces power' },
        { word: 'HAPPINESS', hint: 'State of joy and contentment' },
        { word: 'IMPORTANT', hint: 'Of great significance' },
        { word: 'JELLYFISH', hint: 'Transparent sea creature' },
        { word: 'KNOWLEDGE', hint: 'Information and understanding' },
        { word: 'LIGHTNING', hint: 'Flash of electricity in sky' },
        { word: 'MAGNIFICENT', hint: 'Extremely beautiful' },
        { word: 'NECESSARY', hint: 'Required and essential' },
        { word: 'OBSERVANT', hint: 'Quick to notice details' },
        { word: 'PERFECTLY', hint: 'In an ideal manner' },
        { word: 'QUESTIONS', hint: 'Sentences asking for information' },
        { word: 'REMARKABLE', hint: 'Worthy of attention' },
        { word: 'SURPRISED', hint: 'Caught off guard' },
        { word: 'TECHNOLOGY', hint: 'Application of science' },
        { word: 'UNDERSTAND', hint: 'Comprehend the meaning' },
        { word: 'VEGETABLE', hint: 'Edible plant food' },
        { word: 'WONDERFUL', hint: 'Inspiring delight' },
        { word: 'Xylophone', hint: 'Musical instrument with bars' },
        { word: 'YESTERDAY', hint: 'The day before today' },
        { word: 'ZEBRAFISH', hint: 'Striped aquarium fish' },
        { word: 'ADVENTURE', hint: 'Exciting unusual experience' },
        { word: 'BRILLIANT', hint: 'Exceptionally clever or bright' },
        { word: 'CREATIVE', hint: 'Using imagination to make new things' },
        { word: 'DISCOVERY', hint: 'Finding something new' },
        { word: 'EXCELLENT', hint: 'Extremely good quality' },
        { word: 'FURNITURE', hint: 'Movable items in a room' },
        { word: 'GRATEFUL', hint: 'Feeling thankful' },
        { word: 'HOSPITAL', hint: 'Place for medical treatment' },
        { word: 'INCREDIBLE', hint: 'Hard to believe' },
        { word: 'JOURNALIST', hint: 'Person who reports news' },
        { word: 'KANGAROO', hint: 'Jumping Australian marsupial' },
        { word: 'LANGUAGE', hint: 'System of communication' },
        { word: 'MOUNTAIN', hint: 'Very high natural elevation' },
        { word: 'NOTEBOOK', hint: 'Book for writing notes' },
        { word: 'ORIGINAL', hint: 'First of its kind' },
        { word: 'PAINTING', hint: 'Art made with colors on canvas' },
        { word: 'QUARTERLY', hint: 'Happening four times a year' },
        { word: 'RESTAURANT', hint: 'Place to eat meals' },
        { word: 'SATELLITE', hint: 'Object orbiting a planet' },
        { word: 'TELEPHONE', hint: 'Device for voice communication' },
        { word: 'UNIVERSITY', hint: 'Higher education institution' },
        { word: 'VOLCANO', hint: 'Mountain that erupts lava' },
        { word: 'WILDFLOWER', hint: 'Flower growing in nature' },
        { word: 'XYLOPHONE', hint: 'Percussion instrument with wooden bars' },
        { word: 'YOUTHFUL', hint: 'Having qualities of youth' },
        { word: 'ZEPPELIN', hint: 'Large airship' },
        { word: 'ACCURATE', hint: 'Correct and precise' },
        { word: 'BROADCAST', hint: 'Transmit on radio or TV' },
        { word: 'CELEBRATE', hint: 'Mark a special occasion' },
        { word: 'DEDICATED', hint: 'Committed to a purpose' },
        { word: 'EFFICIENT', hint: 'Achieving maximum productivity' },
        { word: 'FASCINATE', hint: 'Capture intense interest' },
        { word: 'GENEROUS', hint: 'Willing to give freely' },
        { word: 'HAPPENING', hint: 'Event taking place' },
        { word: 'IDENTICAL', hint: 'Exactly the same' },
      ],
    },
  };

  /** Build 210 levels from word tiers */
  function buildLevels() {
    const levels = [];
    const easy = WORD_TIERS.easy.words;
    const medium = WORD_TIERS.medium.words;
    const hard = WORD_TIERS.hard.words;
    const expert = WORD_TIERS.expert.words;

    for (let i = 1; i <= 210; i++) {
      let tier, wordData, difficulty;

      if (i <= 50) {
        tier = easy;
        difficulty = 'easy';
        wordData = tier[(i - 1) % tier.length];
      } else if (i <= 110) {
        tier = medium;
        difficulty = 'medium';
        wordData = tier[(i - 51) % tier.length];
      } else if (i <= 170) {
        tier = hard;
        difficulty = 'hard';
        wordData = tier[(i - 111) % tier.length];
      } else {
        tier = expert;
        difficulty = 'expert';
        wordData = tier[(i - 171) % tier.length];
      }

      levels.push({
        level: i,
        word: wordData.word.toUpperCase(),
        hint: wordData.hint,
        difficulty,
        timeLimit: difficulty === 'easy' ? 60 : difficulty === 'medium' ? 45 : difficulty === 'hard' ? 35 : 30,
        baseScore: difficulty === 'easy' ? 100 : difficulty === 'medium' ? 150 : difficulty === 'hard' ? 200 : 300,
      });
    }
    return levels;
  }

  const LEVELS = buildLevels();
  const TOTAL_LEVELS = LEVELS.length;

  let state = {
    currentLevel: 1,
    slots: [],
    letters: [],
    selectedSlot: null,
    score: 0,
    timer: null,
    timeLeft: 0,
    isPlaying: false,
  };

  function getSavedLevel() {
    return parseInt(localStorage.getItem(STORAGE_KEYS.currentLevel) || '1', 10);
  }

  function saveProgress(level, scoreEarned) {
    const current = getSavedLevel();
    const nextLevel = level + 1;
    if (nextLevel > current) {
      localStorage.setItem(STORAGE_KEYS.currentLevel, String(nextLevel));
    }

    const totalScore = parseInt(localStorage.getItem(STORAGE_KEYS.totalScore) || '0', 10) + scoreEarned;
    localStorage.setItem(STORAGE_KEYS.totalScore, String(totalScore));

    const completed = JSON.parse(localStorage.getItem(STORAGE_KEYS.completedLevels) || '[]');
    if (!completed.includes(level)) {
      completed.push(level);
      localStorage.setItem(STORAGE_KEYS.completedLevels, JSON.stringify(completed));
      localStorage.setItem(STORAGE_KEYS.levelsCompleted, String(completed.length));
    }
  }

  function shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function scrambleWord(word) {
    const letters = word.split('');
    let scrambled = shuffleArray(letters);
    while (scrambled.join('') === word && letters.length > 1) {
      scrambled = shuffleArray(letters);
    }
    // Add decoy letters for harder levels
    const level = state.currentLevel;
    const decoys = 'AEIOURSTLN';
    if (level > 50) {
      const extra = Math.min(Math.floor(level / 50), 3);
      for (let i = 0; i < extra; i++) {
        scrambled.push(decoys[Math.floor(Math.random() * decoys.length)]);
      }
    }
    return shuffleArray(scrambled);
  }

  function getLevelData(levelNum) {
    return LEVELS[Math.min(Math.max(levelNum, 1), TOTAL_LEVELS) - 1];
  }

  function initTheme() {
    document.documentElement.setAttribute('data-theme', localStorage.getItem('theme') || 'light');
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
      });
    }
  }

  function renderHUD(levelData) {
    const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setText('game-level', levelData.level);
    setText('game-score', state.score);
    setText('game-hint-text', levelData.hint);

    const badge = document.getElementById('difficulty-badge');
    if (badge) {
      badge.textContent = levelData.difficulty;
      badge.className = `difficulty-badge difficulty-badge--${levelData.difficulty}`;
    }
  }

  function renderSlots(word) {
    const container = document.getElementById('game-slots');
    if (!container) return;
    container.innerHTML = '';
    state.slots = new Array(word.length).fill(null);

    for (let i = 0; i < word.length; i++) {
      const slot = document.createElement('button');
      slot.className = 'word-slot';
      slot.dataset.index = i;
      slot.setAttribute('aria-label', `Letter slot ${i + 1}`);
      slot.addEventListener('click', () => handleSlotClick(i));
      container.appendChild(slot);
    }
  }

  function renderLetters(letters) {
    const container = document.getElementById('game-letters');
    if (!container) return;
    container.innerHTML = '';
    state.letters = letters.map((letter, index) => ({ letter, index, used: false }));

    state.letters.forEach((item, i) => {
      const tile = document.createElement('button');
      tile.className = 'letter-tile';
      tile.textContent = item.letter;
      tile.dataset.index = i;
      tile.setAttribute('aria-label', `Letter ${item.letter}`);
      tile.addEventListener('click', () => handleLetterClick(i));
      container.appendChild(tile);
    });
  }

  function updateSlotDisplay() {
    const slotEls = document.querySelectorAll('.word-slot');
    slotEls.forEach((el, i) => {
      const slot = state.slots[i];
      el.textContent = slot ? slot.letter : '';
      el.classList.toggle('filled', !!slot);
    });
  }

  function updateLetterDisplay() {
    const letterEls = document.querySelectorAll('.letter-tile');
    letterEls.forEach((el, i) => {
      el.classList.toggle('used', state.letters[i]?.used);
    });
  }

  function handleLetterClick(letterIndex) {
    if (!state.isPlaying) return;
    const letterItem = state.letters[letterIndex];
    if (!letterItem || letterItem.used) return;

    const emptySlot = state.slots.findIndex((s) => s === null);
    if (emptySlot === -1) return;

    state.slots[emptySlot] = { letterIndex, letter: letterItem.letter };
    letterItem.used = true;
    updateSlotDisplay();
    updateLetterDisplay();

    if (state.slots.every((s) => s !== null)) {
      checkAnswer();
    }
  }

  function handleSlotClick(slotIndex) {
    if (!state.isPlaying) return;
    const slot = state.slots[slotIndex];
    if (!slot) return;

    state.letters[slot.letterIndex].used = false;
    state.slots[slotIndex] = null;
    updateSlotDisplay();
    updateLetterDisplay();
  }

  function checkAnswer() {
    const levelData = getLevelData(state.currentLevel);
    const answer = state.slots.map((s) => s.letter).join('');
    state.isPlaying = false;
    stopTimer();

    if (answer === levelData.word) {
      const timeBonus = Math.floor(state.timeLeft * 2);
      const earned = levelData.baseScore + timeBonus;
      state.score += earned;
      saveProgress(state.currentLevel, earned);
      showFeedback(true, earned, levelData.word);
    } else {
      document.querySelectorAll('.word-slot').forEach((el) => el.classList.add('incorrect'));
      setTimeout(() => showFeedback(false, 0, levelData.word), 600);
    }
  }

  function showFeedback(success, earned, word) {
    const overlay = document.getElementById('game-feedback');
    if (!overlay) return;

    overlay.hidden = false;
    overlay.className = `game-feedback game-feedback--${success ? 'success' : 'error'}`;

    document.getElementById('feedback-icon').textContent = success ? '🎉' : '😔';
    document.getElementById('feedback-title').textContent = success ? 'Correct!' : 'Try Again';
    document.getElementById('feedback-message').textContent = success
      ? `You packed "${word}" perfectly!`
      : `The correct word was "${word}". Keep practicing!`;
    document.getElementById('feedback-score').textContent = success ? `+${earned} points` : '';
    document.getElementById('feedback-score').hidden = !success;

    const nextBtn = document.getElementById('feedback-next');
    const retryBtn = document.getElementById('feedback-retry');

    if (success) {
      if (state.currentLevel >= TOTAL_LEVELS) {
        nextBtn.textContent = 'Finish';
        nextBtn.onclick = () => { window.location.href = 'dashboard.html'; };
      } else {
        nextBtn.textContent = 'Next Level';
        nextBtn.onclick = () => {
          overlay.hidden = true;
          startLevel(state.currentLevel + 1);
        };
      }
      retryBtn.hidden = true;
      nextBtn.hidden = false;
    } else {
      retryBtn.hidden = false;
      nextBtn.hidden = true;
      retryBtn.onclick = () => { overlay.hidden = true; startLevel(state.currentLevel); };
    }
  }

  function startTimer(seconds) {
    stopTimer();
    state.timeLeft = seconds;
    const fill = document.getElementById('timer-fill');
    const maxTime = seconds;

    state.timer = setInterval(() => {
      state.timeLeft--;
      if (fill) fill.style.width = `${(state.timeLeft / maxTime) * 100}%`;
      if (state.timeLeft <= 0) {
        stopTimer();
        state.isPlaying = false;
        const levelData = getLevelData(state.currentLevel);
        showFeedback(false, 0, levelData.word);
      }
    }, 1000);
  }

  function stopTimer() {
    if (state.timer) { clearInterval(state.timer); state.timer = null; }
  }

  function startLevel(levelNum) {
    const levelData = getLevelData(levelNum);
    state.currentLevel = levelData.level;
    state.isPlaying = true;

    renderHUD(levelData);
    renderSlots(levelData.word);
    renderLetters(scrambleWord(levelData.word));
    startTimer(levelData.timeLimit);

    localStorage.setItem(STORAGE_KEYS.currentLevel, String(state.currentLevel));
  }

  function setupActions() {
    document.getElementById('btn-clear')?.addEventListener('click', () => {
      if (!state.isPlaying) return;
      state.slots.forEach((slot) => {
        if (slot) state.letters[slot.letterIndex].used = false;
      });
      state.slots.fill(null);
      updateSlotDisplay();
      updateLetterDisplay();
    });

    document.getElementById('btn-shuffle')?.addEventListener('click', () => {
      if (!state.isPlaying) return;
      const unused = state.letters.filter((l) => !l.used);
      const shuffled = shuffleArray(unused);
      let si = 0;
      state.letters.forEach((l) => { if (!l.used) l.letter = shuffled[si++].letter; });
      const container = document.getElementById('game-letters');
      if (container) {
        const tiles = container.querySelectorAll('.letter-tile');
        state.letters.forEach((l, i) => { if (!l.used && tiles[i]) tiles[i].textContent = l.letter; });
      }
    });

    document.getElementById('btn-check')?.addEventListener('click', () => {
      if (!state.isPlaying) return;
      if (state.slots.every((s) => s !== null)) checkAnswer();
    });

    document.getElementById('btn-exit')?.addEventListener('click', () => {
      stopTimer();
      window.location.href = 'dashboard.html';
    });
  }

  function init() {
    if (!API.requireAuth()) return;
    initTheme();
    setupActions();

    const params = new URLSearchParams(window.location.search);
    const urlLevel = parseInt(params.get('level'), 10);
    const startAt = urlLevel || getSavedLevel();
    startLevel(Math.min(Math.max(startAt, 1), TOTAL_LEVELS));
  }

  document.addEventListener('DOMContentLoaded', init);

  return { LEVELS, TOTAL_LEVELS };
})();
