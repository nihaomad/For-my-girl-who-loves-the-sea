/* ============ EDIT THESE ============ */

// Accepted answers to the gate question. Capitals, spaces and punctuation don't matter.
const ANSWERS = ["Don Buri", "donburi"];

// A gentle hint shown after two wrong tries.
const HINT = "Think of the japanese food we always grab and eat somewhere ♡";

// The words that type out after she opens the sealed letter.
const INTRO_TEXT = "Hi, baby.\nWhatever you're feeling right now, I made something for it.\nPick an envelope whenever you need me.";

const LETTERS = [
  { key:"happy", feel:"you're happy", tint:"#f3cfd2", title:"Open when you're happy",
    body:[
      "Look at you, baby, smiling. I wish I could see it right now.",
      "I hope you remember this feeling, because this is what you deserve every day. Don't let anyone ruin your day po ah?",
      "Tell me about it later, okay? Ichika mo sa akin kahit ano pa yan. Call me po later or I'll call you HAHAHA"
    ]},
  { key:"sad", feel:"you're sad", tint:"#d9a7b0", title:"Open when you're sad",
    body:[
      "Come here, baby. You don't have to explain anything po.",
      "It's okay to be sad, baby. Damahin mo lang po and you don't need to pretend you're fine for anyone, especially pagdating sa akin. Cry if you need to, rest if you need to.",
      "This feeling won't stay forever, but I will. When you're ready, sabihin mo po sa'kin, and I'll be right there agad."
    ]},
  { key:"overthinking", feel:"you're overthinking", tint:"#e8c4b8", title:"Open when you're overthinking",
    body:[
      "Breathe in slowly. Hold it. Now let it go po",
      "You can tell me anything po ah? I'm here and I won't go anywhere, baby. You're enough, you're capable and you can do anything, even if you're not believing yourself, always remember na andito ako na laging naniniwala sa'yo",
      "Put the phone down for a bit, drink some water, and rest. I love you, baby."
    ]},
  { key:"doubt", feel:"you doubt yourself", tint:"#c98a96", title:"Open when you doubt yourself",
    body:[
      "Baby, let me remind you who you are.",
      "You are smart, kind, and so much stronger than you give yourself credit for. Madami ka nang napagdaanan na mas malala pa dito and you stayed kind and genuine",
      "Do not think 'what if di ko kayanin' because I know you can, kahit di ka pa naniniwala sa sarili mo na kaya mo. I'm always here believing in you na kaya mo at kakayanin mo. Fighting, baby!!!"
    ]},
  { key:"angry", feel:"you're angry", tint:"#a64d5f", title:"Open when you're angry",
    body:[
      "Okay, Baby. You're allowed to be mad. Let it out.",
      "Your anger makes sense, even if not everyone gets why. Your feelings are valid okay po? Rant to me, scream into a pillow, throttle therapy? ket 60 lang takbo HAHAHAH, whatever you need.",
      "And if you're angry at me, that's okay too. Tell me when you're ready. I'd rather hear it and fix it than have you carry it alone, baby. I'll patiently wait until you're ready to talk about it. I love you, babyy."
    ]},
  { key:"upset", feel:"you're upset", tint:"#e2b3a8", title:"Open when you're upset",
    body:[
      "Hiii, baby. I can tell something got to you.",
      "Whatever it is, big or small, it matters to me because it matters to you. Di mo kailangan mag panggap na okay ka lang or di ka nasaktan.",
      "I'll listen to every word, and I'll stay right here until you feel a little lighter. I'll buy you your favorite drink or chocolate hehe."
    ]},
  { key:"reassurance", feel:"you need reassurance", tint:"#b86b7c", title:"Open when you need reassurance",
    body:[
      "Here it is, in writing, so you can read it as many times as you want.",
      "I love you Ms. Kazel 'Faye' Morales Olaño, my babyy. I'm not going anywhere po ah. You are not too much, and you are always enough. I love you and ikaw lang ang pipiliin ko sa araw-araw na gagawin ng Diyos",
      "If you need reassurance, baby, wag kang mahiyang sabihin sa 'kin, and I'll tell you even if it takes a hundred times. And whenever you wonder if I still feel the same, come back to this letter. The answer will always be yes."
    ]},
  { key:"miss", feel:"you miss me", tint:"#f0bfc6", title:"Open when you miss me",
    body:[
      "Hiii, baby. Miss mo na agad ako? I miss you too, more than you know.",
      "Ikaw ah, miss mo na agad ako HAHAHA. Kidding aside, I miss you too. I crave for your presence naman po always.",
      "Baby, chat me or call me, kahit anong oras and I'll do the same naman po hehe. And keep this in mind: every day that passes is one day closer to seeing you again."
    ]}
];

// The song that plays on the envelope page. Plays the whole song and repeats while she stays.
// Leave empty ("") for no music there.
const WALL_SONG = "assets/panaginip.mp3"; // nicole - Panaginip

// Your sea video, e.g. "assets/sea.mp4". Leave empty ("") to show the drawn sea instead.
const SEA_VIDEO = "";

// Your song for the sea scene, e.g. "assets/song.mp3". Leave empty ("") for no song.
const SEA_SONG = "assets/song.mp3"; // Amiel Sol - Ikaw Lang Patutunguhan

// Where the song starts, as "m:ss" (e.g. "1:05"). Set it to where "Sa'n man maglayag" begins.
const SEA_SONG_START = "4:38";

// Optional: where to loop back to the start, as "m:ss" (e.g. "1:25"), so only that part repeats.
// Leave empty ("") to let the rest of the song play, then loop from SEA_SONG_START.
const SEA_SONG_END = "5:29";

// Keep the song playing softly after the sea scene (true) or fade it out (false).
const SONG_KEEP_PLAYING = false;

// Seconds before the Continue button appears (it also appears when the video ends).
const SEA_CONTINUE_AFTER = 5;

/* ==================================== */
