// ==== DATA AND CONFIGURATION ====

// Micro-Narrative arcs for ongoing stories
const narrativeArcs = {
    vanishingMug: [
        { author: "Luis R.", content: "Missing: blue coffee mug with ‘World’s Okayest Employee’ label." },
        { author: "Maria T.", content: "Spotted a similar mug in the wellness room... or was it a dream?" },
        { author: "Luis R.", content: "Got it back! But it was in the supply closet... on the top shelf?" },
        { author: "Luis R.", content: "Mug keeps moving. Kitchen to break room to my desk. Someone's messing with me" },
        { author: "Maria T.", content: "We should just start a mug-sharing program. Embrace the chaos." }
    ],
    ghostOfConfD: [
        { author: "Maria T.", content: "Booked Conference D, but lights flicker when no one’s inside." },
        { author: "Aisha H.", content: "Chair arrangement keeps changing between meetings." },
        { author: "David W.", content: "Why does the calendar list recurring meetings for ‘Room D - Occupant 0’?" },
        { author: "Facilities", content: "Conference D chair sensors show movement during unbooked hours" },
        { author: "Maria T.", content: "Room D now blocked out indefinitely. Good call." }
    ],
    paperclipMystery: [
        { author: "Min-Jae P.", content: "Office inventory: short by 732 paperclips. Unusual." },
        { author: "Ravi P.", content: "I’ve been unbending paperclips for a sculpture. Might be related?" },
        { author: "Min-Jae P.", content: "Returning 98 clips from my desk drawer. Count still off." },
        { author: "Min-Jae P.", content: "Paperclips now arranged in perfect geometric patterns. No one remembers doing this." }
    ],
    newHireMystery: [
        { author: "Anika S.", content: "New person starting Monday. Anyone know what department?" },
        { author: "David W.", content: "Got welcome email for 'Alex Chen' but no manager assignment listed" },
        { author: "Maria T.", content: "Set up desk for Alex but nameplate says 'A. Chen – Dept TBD'" },
        { author: "Luis R.", content: "It's Wednesday. Still haven’t met Alex. Badge shows active though" }
    ],
    efficiencyConsultant: [
        { author: "System", content: "Productivity consultant will observe workflows this week" },
        { author: "Ravi P.", content: "Consultant took notes on my bathroom break timing. Weird" },
        { author: "Zoe B.", content: "efficiency guy asked how many keystrokes I use per email............." },
        { author: "David W.", content: "Consultant’s report recommends 'attention optimization protocols'" },
        { author: "System", content: "Efficiency improvements will be implemented gradually" }
    ],
    janetsFinalWeek: [
        { author: "Kevin O.", content: "Janet’s last week. Been here 32 years. Legend." },
        { author: "Luis R.", content: "Organizing photo slideshow for Janet’s sendoff." },
        { author: "Maria T.", content: "Found a photo of Janet with the first coffee machine we ever had." },
        { author: "Kevin O.", content: "Retirement party Friday at 3 for everyone's favorite colleague, Janet! Don’t miss it." },
        { author: "Luis R.", content: "Goodbye, Janet. You left this place better than you found it." }
    ],
    whiteboardTheories: [
        { author: "Ravi P.", content: "Whiteboard in conference room B now has flowchart about ‘The Great Stapler Swap.’" },
        { author: "Anika S.", content: "Added a sticky note that says ‘follow the paper trail.’" },
        { author: "Aisha H.", content: "Stapler Swap chart updated—now involves 'regional managers' and 'the moon landing.’" },
        { author: "Ravi P.", content: "New color-coded lines added. Who is doing this?" },
        { author: "Facilities", content: "Please refrain from using conference room B whiteboard for personal theories." }
    ],
    elevatorWhispers: [
        { author: "Zoe B.", content: "why does elevator B make a whispering sound now?? 👀" },
        { author: "Kevin O.", content: "Back in my day, that elevator sang. True story." },
        { author: "Min-Jae P.", content: "Recorded the audio from Elevator B. Spectrum shows human voice range." },
        { author: "Zoe B.", content: "someone said it whispered their name. not even kidding 😨" },
        { author: "Facilities", content: "Elevator B offline for diagnostic maintenance." }
    ],
    phantomExtension: [
        { author: "David W.", content: "Does anyone know who’s assigned to extension 4217? Keeps calling and then hanging up." },
        { author: "Jen C.", content: "I traced extension 4217—doesn’t exist on our phone map." },
        { author: "Aisha H.", content: "Voicemail on 4217 is just static and a distant beeping. It’s unsettling." },
        { author: "David W.", content: "Facilities says Room 217 was converted years ago. But there’s light under the door." },
        { author: "System Message", content: "Extension 4217 has been decommissioned." }
    ]
};

const followUpTemplates = {
    lost_and_found: ["Never mind, I found my {TOPIC}!", "Good news, my {TOPIC} turned up."],
    facilities: ["The issue with the {TOPIC} has been resolved. Apologies for the inconvenience.", "Maintenance on the {TOPIC} is complete."],
    events: ["Wow, those {TOPIC} disappeared in record time!", "Hope everyone who got some {TOPIC} enjoyed them!"],
    weirdness: ["Mystery solved. The {TOPIC} was just a loose panel in the ceiling.", "So it turns out the {TOPIC} was nothing to worry about."],
    deadlines: ["Just submitted my {TOPIC} with two minutes to spare. That was close.", "Finally done with the {TOPIC}. What a relief!"]
};

const categoryToTopicKey = { lost_and_found: 'ITEM', facilities: 'ISSUE', events: 'SNACKS', weirdness: 'WEIRD_THING', deadlines: 'DEADLINE_ITEM' };
const templates = { lost_and_found: ["Did anyone find a {ITEM} in the {LOCATION}?"], events: ["{EVENT} at {TIME} in {LOCATION} - come for {SNACKS}."], weirdness: ["Has anyone else noticed {WEIRD_THING} in the {LOCATION}?", "Is it just me or is there {WEIRD_THING} near the {LOCATION}?"], form_questions: ["Need form {FORM_NUMBER} for {PROCESS} - where do I find it?"], time_observations: ["Been here {TIME_PERIOD} and noticed {WEIRD_THING}."], task_updates: ["Finally finished {TASK} - only took {TIME_AMOUNT}."], confusion: ["{CONFUSED_STATEMENT} - is this normal?"], facilities: ["{ISSUE} in the {LOCATION} - {INSTRUCTION}."], nostalgia: ["Does anyone remember {NOSTALGIC_REFERENCE}?", "Remember {NOSTALGIC_REFERENCE}? Good times."], deadlines: ["{DEADLINE_ITEM} due by {TIME} - {CONSEQUENCE}."], madlibs: ["{ADJECTIVE} {NOUN} in the {LOCATION} - {REACTION}."], complaints: ["Why does the {COMPLAINT_THING} always {COMPLAINT_VERB} when {COMPLAINT_SITUATION}?"], anyone_else: ["Does anyone else {EXPERIENCE}, or just me?"], time_mysteries: ["{TIME_REFERENCE}, {MYSTERY_ACTION}, but now {MYSTERY_CONFUSION}."], emoji_reactions: ["{STATEMENT} {EMOJI_CLUSTER}"], overheard: ["Overheard in the {LOCATION}: '{QUOTE}'"], praise_and_thanks: ["Big shout-out to {OTHER_NAME} for helping me out with {TASK}!", "Just wanted to say thanks to whoever restocked the {SNACKS} in the break room. You're a hero!", "The {DEPT} team really knocked it out of the park with the {PROJECT_NAME} launch. Great work, everyone!"], tech_support: ["Is {APP} running super slow for anyone else today?", "My monitor keeps making a {WEIRD_NOISE} sound. Submitted a ticket to IT.", "The shared drive seems to be down. Can anyone from IT confirm?"], weekend_chat: ["Hope everyone had a great weekend! Ready to tackle the week.", "Did anyone else try {FOOD_PLACE} over the weekend? Thoughts?", "That {SPORT_TEAM} game was a nail-biter. Can't believe that last-second shot."] };

const knownChars = [
    { name: "Jen C.", allowedCategories: ["weirdness", "time_observations", "anyone_else"], customPosts: ["has anyone else noticed that the lobby carpet pattern never lines up?", "i swear the thermostat resets itself every hour.", "anyone know who replaced the staplers with plastic models?"] },
    { name: "Ravi P.", allowedCategories: ["lost_and_found", "form_questions", "task_updates", "tech_support"], customPosts: ["need Form HR-204 for vacation request—anyone point me to it?", "finally cleared my inbox—took all night.", "did anyone turn in a pair of glasses with a red frame?"] },
    { name: "Maria T.", allowedCategories: ["events", "nostalgia", "facilities", "praise_and_thanks"], customPosts: ["team lunch tomorrow at noon in the break room—bring your own tacos.", "does anyone remember when the coffee was free?", "facilities said they fixed the air conditioning—still hot."] },
    { name: "Aisha H.", allowedCategories: ["weirdness", "time_observations", "form_questions"], customPosts: [ "Notice the new security cameras in the east hallway? When were those installed?", "Has anyone reviewed the updated employee handbook? Section 12 seems different", "Interesting choice to change the lobby music from classical to ambient sounds", "The quarterly survey asks some unusual questions this time. Anyone else notice?", "Fire drill procedures posted by the elevator look revised. Worth reviewing", "Submitted my project proposal early. Always better to be prepared", "Conference room A has new seating arrangements. More collaborative setup", "Third time this month the water cooler conversation stopped when I approached", "Monthly department metrics are available in the shared drive now", "Office layout changes seem strategic. Wonder what the reasoning was", "Training materials updated last week. Good to stay current with protocols", "Parking lot traffic patterns have shifted since the construction started" ] },
    { name: "Luis R.", allowedCategories: ["events", "praise_and_thanks", "weekend_chat"], customPosts: [ "Organizing a group card for Maria's work anniversary. Sign it in the break room!", "Anyone need a ride to the team lunch Thursday? I've got room for three", "Started a coffee fund collection. $5 gets you premium blend for the month", "Volunteering for the charity drive committee again. It's always worth it", "New employee orientation next week. Let's give them a warm welcome!", "Setting up the conference room for the all-hands meeting. Happy to help", "Found someone's keys by the elevator. Blue Honda keychain", "Holiday potluck planning starts now! I'll coordinate the signup sheet", "Blood drive next month. I'll be there as usual. Who's with me?", "Helping Janet clean out her office before retirement. So many memories!", "Office birthday calendar updated. Don't want to miss anyone's special day", "Weather's getting nice. Anyone interested in lunchtime walking group?" ] },
    { name: "David W.", allowedCategories: ["deadlines", "complaints", "tech_support"], customPosts: [ "Quarterly budget review meeting moved to Conference Room C at 2:30PM", "Please remember to submit your timesheets by Friday EOD", "New project deadlines came in from corporate. Will send updated timeline Monday", "Anyone know the WiFi password for the guest network?", "Quarterly metrics show 127% efficiency. Is that mathematically possible?", "Office supplies order going in tomorrow. Send me requests by noon", "Team lunch at Olive Garden Thursday 12:30. RSVP if you're coming", "Parking lot construction starts next week. Use the south entrance", "Performance reviews due next Friday. Check your email for the forms", "New org chart shows me reporting to someone I've never met", "IT says the server maintenance window is this Saturday 6AM-10AM", "Holiday party planning committee needs volunteers" ] },
    { name: "Anika S.", allowedCategories: ["form_questions", "task_updates", "weekend_chat"], customPosts: [ "First week down! Still figuring out the coffee machine settings", "Where do I find the office supply request forms?", "Thanks everyone for the warm welcome. Excited to be here!", "Quick question: do we have assigned parking spots or first come first served?", "My badge photo was taken at an angle I don't remember posing for", "Learning the ropes on the new CRM system. Any tips appreciated!", "Love the team lunch tradition. When's the next one?", "Submitted my first expense report. Hope I did it right!", "Still getting lost trying to find Conference Room B", "Benefits enrollment deadline is Friday right? Want to make sure", "Can someone show me where the good printer is? Mine keeps jamming", "Really enjoying the work so far. Great team environment here" ] },
    { name: "Kevin O.", allowedCategories: ["nostalgia", "complaints", "events"], customPosts: [ "Been here 23 years. Anyone remember when the cafeteria had that good chili?", "Retirement party for Janet next Friday in the break room. Bring a dish!", "They're repaving the parking lot again. Third time since I started", "Found my old desk in storage. Nameplate says 'K. O'Malley, Dept 7B'", "Weather's getting cold. Time to break out the space heater", "Anyone else miss the old coffee brand? This new stuff tastes like water", "Grandkids are visiting this weekend. Can't wait to show them the photo album", "March madness brackets anyone? I'll email the template around", "Remember to set your clocks back this weekend folks", "Used to know everyone's name on this floor. Building's grown so much", "Break room microwave finally died. About time we got a new one", "Thirty years until I can retire. But who's counting?" ] },
    { name: "Zoe B.", allowedCategories: ["emoji_reactions", "complaints", "weekend_chat"], customPosts: [ "coffee machine is broken again ugh ☕💔", "who keeps eating people's lunches from the fridge 🥪😤", "happy friday everyone!! weekend plans? 🎉", "office playlist needs updating... same songs for 3 months 🎵", "wifi password is 'StayFocused2024' but changes to random numbers when I type it 📡", "anyone know if we get columbus day off? 📅", "new person starting monday! wonder what team they're on 👋", "break room vending machine ate my dollar................... classic 🤖💸", "tornado watch today... hope everyone gets home safe ⛈️", "birthday cake in conference a at 3pm!! 🎂", "my monitor keeps flickering... IT ticket submitted 💻", "potluck signup sheet is full already?? fast crowd 🍕" ] },
    { name: "Min-Jae P.", allowedCategories: ["task_updates", "time_observations", "facilities"], customPosts: [ "Office temperature is 72.3 degrees today. Comfortable working conditions", "Submitted quarterly report 2 days early. Always good to stay ahead", "Printer paper restocked. Full supply of 20lb white standard", "Conference room booking confirmed for Tuesday 10AM-11:30AM", "Badge scanner beeps twice for everyone except maintenance staff (three beeps)", "Monthly expense total: $247.83. Within budget parameters", "Project timeline updated in shared drive. Phase 2 starts November 1st", "Coffee machine dispenses 6.2 oz cups. Specs say 6.0 oz capacity", "Timesheet submitted. 40.25 hours logged for this pay period", "Office plant watering completed. Next scheduled for Thursday", "Meeting notes uploaded to shared folder. Action items highlighted", "Supply inventory complete. All items accounted for and cataloged" ] }
];

const poolData = { DEPT: ["HR", "IT", "Accounting", "Maintenance", "Admin", "Legal", "Facilities", "Marketing", "Sales"], ITEM: ["stapler", "phone charger", "notebook", "badge", "umbrella", "coffee mug", "noise-canceling headphones", "blue coffee mug with a chip on the rim", "ergonomic mousepad", "Tupperware with a green lid", "company-branded fleece jacket", "a single, mysterious key", "a worn-out copy of a sci-fi novel"], LOCATION: ["break room", "parking lot", "conference room B", "supply closet", "3rd floor lobby", "quiet room on the 4th floor", "wellness center", "main entrance", "west-wing stairwell", "server room", "marketing department's 'ideation space'"], EVENT: ["safety training", "onboarding debrief", "a team sync", "a retirement party"], SNACKS: ["donuts", "pizza", "bagels", "cookies", "fruit salad", "leftover birthday cake"], WEIRD_THING: ["the lights flickering", "a weird draft", "the carpet pattern shifting", "a strange humming noise", "a faint smell of ozone", "the sound of marbles dropping from the ceiling", "the clocks running backward for a minute", "a flickering light that spells out 'SOS' in morse code", "all the plants turning to face the wall", "a cold spot right in the middle of the hallway"], FORM_NUMBER: ["B-171", "HR-204", "IT-99", "FAC-12"], PROCESS: ["equipment checkout", "a benefits update", "visitor access"], TASK: ["the quarterly compliance training", "updating the directory", "reconciling petty cash", "the TPS reports", "archiving old project files", "submitting the travel reimbursements", "verifying emergency contacts", "reviewing the new handbook", "rotating the office plants", "refreshing the conference-room calendars"], TIME_AMOUNT: ["4 hours", "all morning", "3 attempts", "2 days"], CONFUSED_STATEMENT: ["the printer only prints blank pages", "I have a key for Room 301 but it doesn’t exist", "meetings I didn’t schedule keep appearing on my calendar"], ISSUE: ["water pressure issues", "heating system maintenance", "elevator B being out of service"], INSTRUCTION: ["expect fluctuations", "please use other floors", "please take the stairs", "avoid the east wing", "notify facilities if it persists", "fill out a service ticket", "plan for brief outages", "hold your breath briefly", "report any odd noises"], NOSTALGIC_REFERENCE: ["when the break room chairs were blue", "what department used to be on the 4th floor", "the old coffee machine that actually worked", "the old logo", "when we had that one vending machine with the weird sodas", "the annual chili cook-off", "the 'synergy' posters from 2015"], DEADLINE_ITEM: ["Timesheet corrections", "Benefits enrollment forms", "New badge photos", "Quarterly security training", "Expense report submissions", "Office safety acknowledgements", "Vendor contract renewals", "Year-end performance self-reviews", "Workspace ergonomics assessments"], CONSEQUENCE: ["late submissions will require manager approval", "failure to submit means waiting until next year", "old badges will be deactivated after today"], ADJECTIVE: ["an unusual", "a forgotten", "a mysterious", "an anomalous", "a suspicious"], NOUN: ["document", "briefcase", "sandwich", "envelope", "folder"], REACTION: ["This seems off.", "Should we call security?", "It smells questionable.", "There's no return address."], EXPERIENCE: ["hearing my name called in empty offices", "seeing the carpet patterns shift with the light", "finding my keycard works on the wrong doors"], TIME_REFERENCE: ["Yesterday", "This morning", "Last week", "An hour ago", "Earlier today", "Over the weekend", "Two days ago", "Late last night", "Earlier this afternoon", "First thing this AM"], STATEMENT: ["the coffee machine is fixed again", "i found my missing pen", "the elevator music has changed"], EMOJI_CLUSTER: ["🎉☕✨", "🖊️❓😅", "🎵👀😐", "😬📈🔍", "🚧⚠️🔧", "🤯💡🔒", "🥳🍩☕", "🛠️💻🔄"], QUOTE: ["the new hire looks exactly like the old supervisor", "room 237 used to be bigger, I swear", "they moved the security cameras again"], OTHER_NAME: ["Sarah J.", "Mike P.", "the whole IT crew", "whoever was on duty last night", "the person who sits by the window"], PROJECT_NAME: ["Orion Initiative", "Project Chimera", "the Q3 Synergy Report", "the new onboarding portal", "the client retention strategy"], APP: ["the timesheet portal", "my email client", "the shared calendar", "the internal messaging app"], WEIRD_NOISE: ["clicking", "whirring", "faint buzzing", "high-pitched squeal"], FOOD_PLACE: ["that new taco place on 5th", "the new sushi spot downtown", "the deli around the corner"], SPORT_TEAM: ["Mets", "Knicks", "Yankees", "Rangers", "Lakers", "Cubs"], COMPLAINTS: [ { thing: 'printer', verb: 'jam', situation: "I'm running late" }, { thing: 'elevator', verb: 'stop', situation: "I'm carrying coffee" }, { thing: 'computer', verb: 'freeze', situation: "I'm about to save a file" }, { thing: 'network', verb: 'disconnect', situation: "I'm in a presentation" } ], MYSTERIES: [ { action: 'I parked on Level 2', confusion: 'my car has been moved to Level 4' }, { action: 'I had 47 emails in my inbox', confusion: 'all the emails have vanished' }, { action: 'I submitted Form B-12', confusion: 'the form has been returned unmarked' } ] };
const toneReacts = { positive: ['👍','❤️','😂'], neutral: ['👍','🤔','😮'], curious: ['🤔','😮'], worrisome: ['😢','🤔','😮'] };
const categoryTone = { lost_and_found: 'neutral', events: 'positive', weirdness: 'curious', form_questions: 'neutral', time_observations:'neutral', task_updates: 'neutral', confusion: 'worrisome', facilities: 'worrisome', nostalgia: 'positive', deadlines: 'worrisome', madlibs: 'positive', complaints: 'worrisome', anyone_else: 'neutral', time_mysteries: 'curious', emoji_reactions: 'positive', overheard: 'curious', praise_and_thanks:'positive', tech_support: 'neutral', weekend_chat: 'positive' };
const randomNames = ["Alex R.", "Ben C.", "Casey L.", "Devon P.", "Eli K.", "Frankie M.", "Gia V.", "Harper S.", "Kai T.", "Leo N.", "Mark W.", "Nico J."];
const usedRandom = new Set();

let reactionEngineTimeout, postEngineTimeout;
let postHistory = [];
let openLoops = [];
// ✅ NEW: State for managing narrative arcs
let activeNarratives = [];
let availableNarrativeKeys = [];
const MAX_POSTS = 50; 

// ==== UTILITY FUNCTIONS ====
function getRandom(arr) { if (!arr || arr.length === 0) return ""; return arr[Math.floor(Math.random() * arr.length)]; }
function getKnownChar() { return getRandom(knownChars); }
function getRandomName() { const available = randomNames.filter(n => !usedRandom.has(n)); if (available.length === 0) { usedRandom.clear(); return getRandom(randomNames); } const pick = getRandom(available); usedRandom.add(pick); return pick; }
function randomTimePeriod() { const units = { years: { min: 1, max: 3 }, months: { min: 2, max: 12 }, weeks: { min: 2, max: 18 }, days: { min: 2, max: 14 }, hours: { min: 1, max: 12 } }; const keys = Object.keys(units); const unit = keys[Math.floor(Math.random() * keys.length)]; const { min, max } = units[unit]; const num = Math.floor(Math.random() * (max - min + 1)) + min; const label = num === 1 ? unit.slice(0, -1) : unit; return `${num} ${label}`; }
function randomTime() { const hour = Math.floor(Math.random() * 10) + 8; const minutes = [0, 15, 30, 45]; const minute = minutes[Math.floor(Math.random() * minutes.length)]; const displayHour = hour > 12 ? hour - 12 : hour; const displayMinute = minute < 10 ? `0${minute}` : minute; const ampm = hour >= 12 ? 'PM' : 'AM'; return `${displayHour}:${displayMinute} ${ampm}`; }

// ==== CORE LOGIC ====
function getNameAndCategory() { if (Math.random() < 0.6) { const kc = getKnownChar(); return { name: kc.name, categories: kc.allowedCategories, custom: kc.customPosts }; } else { return { name: getRandomName(), categories: Object.keys(templates), custom: [] }; } }

function fillPost() {
    const { name, categories, custom } = getNameAndCategory();
    let postContent = "", isFromPerson = false, cat = '', isCustom = false;
    const filledPlaceholders = {};

    if (custom && custom.length > 0 && Math.random() < 0.3) {
        let message = getRandom(custom);
        postContent = `${name}: ${message}`;
        cat = getRandom(categories);
        isCustom = true;
    } else {
        cat = getRandom(categories);
        const tmpl = getRandom(templates[cat]);
        let prefix = '';
        const deptCategories = ['events', 'time_observations', 'confusion', 'complaints', 'praise_and_thanks'];

        if (cat === 'facilities') { prefix = 'Facilities: '; isFromPerson = false; } 
        else if (cat === 'deadlines') { prefix = 'HR Notice: '; isFromPerson = false; } 
        else if (deptCategories.includes(cat)) { const dept = getRandom(poolData['DEPT']); filledPlaceholders['DEPT'] = dept; prefix = `${name} from ${dept}: `; isFromPerson = true; } 
        else { prefix = `${name}: `; isFromPerson = true; }
        
        const fillPlaceholdersFunc = (text) => text.replace(/{(\w+)}/g, (_, key) => {
            if (filledPlaceholders[key]) return filledPlaceholders[key];
            let value;
            if (key === 'TIME_PERIOD') value = randomTimePeriod();
            else if (key === 'TIME') value = randomTime();
            else if (key === 'COMPLAINT_THING') {
                const complaint = getRandom(poolData.COMPLAINTS);
                filledPlaceholders['COMPLAINT_THING'] = complaint.thing;
                filledPlaceholders['COMPLAINT_VERB'] = complaint.verb;
                filledPlaceholders['COMPLAINT_SITUATION'] = complaint.situation;
                return complaint.thing;
            } else if (key === 'MYSTERY_ACTION') {
                const mystery = getRandom(poolData.MYSTERIES);
                filledPlaceholders['MYSTERY_ACTION'] = mystery.action;
                filledPlaceholders['MYSTERY_CONFUSION'] = mystery.confusion;
                return mystery.action;
            }
            else value = getRandom(poolData[key] || [`???`]);
            filledPlaceholders[key] = value;
            return value;
        });

        let message = fillPlaceholdersFunc(tmpl);
        postContent = prefix + message;
    }
    
    const separatorIndex = postContent.indexOf(': ');
    if (separatorIndex > -1) {
        const prefix = postContent.substring(0, separatorIndex + 2);
        let content = postContent.substring(separatorIndex + 2);
        if (isFromPerson) {
            if (name === "Zoe B.") content = content.toLowerCase();
            else if (content) content = content.charAt(0).toUpperCase() + content.slice(1);
        } else if (content) {
            content = content.charAt(0).toUpperCase() + content.slice(1);
        }
        postContent = prefix + content;
    }
    
    const topicKey = categoryToTopicKey[cat];
    let topic = topicKey ? filledPlaceholders[topicKey] : null;
    if (topic) {
        topic = topic.replace(/^(a |an |the )/i, '').trim();
        openLoops.push({ author: name, category: cat, topic: topic, followUpDelay: Math.floor(Math.random() * 5) + 3 });
    }
    
    return { content: postContent, tone: categoryTone[cat] || 'neutral', author: name, templateKey: cat, isCustom: isCustom, topic: topic };
}

function generateFollowUpPost() {
    const readyLoops = openLoops.filter(loop => loop.followUpDelay <= 0);
    if (readyLoops.length === 0) return null;

    const loop = getRandom(readyLoops);
    openLoops = openLoops.filter(l => l !== loop);

    let prefix = '';
    if (loop.category === 'facilities') { prefix = 'Facilities: '; } 
    else { prefix = `${loop.author}: `; }
    
    let message = getRandom(followUpTemplates[loop.category]);
    message = message.replace('{TOPIC}', loop.topic);

    if (loop.author === 'Zoe B.') { message = message.toLowerCase(); } 
    else { message = message.charAt(0).toUpperCase() + message.slice(1); }
    
    const content = prefix + message;
    return { content: content, tone: 'neutral', author: loop.author, templateKey: `${loop.category}_followup`, isCustom: false, topic: null };
}

// ✅ NEW: Generates a post from an active narrative arc.
function generateNarrativePost() {
    // Tick down posts since last narrative post for pacing
    activeNarratives.forEach(arc => arc.postsSinceLast++);

    // Find a narrative that's ready to post
    const readyNarrative = activeNarratives.find(arc => arc.postsSinceLast >= arc.nextPostDelay);
    if (readyNarrative) {
        const arcData = narrativeArcs[readyNarrative.key];
        const postData = arcData[readyNarrative.nextPostIndex];
        
        let content = `${postData.author}: ${postData.content}`;
        if (postData.author === "Zoe B.") {
             content = `${postData.author}: ${postData.content.toLowerCase()}`;
        }

        const post = {
            content: content,
            tone: 'neutral', // Narratives can have a neutral tone for reactions
            author: postData.author,
            templateKey: `narrative_${readyNarrative.key}_${readyNarrative.nextPostIndex}`,
            isCustom: true,
            topic: null
        };

        // Update the narrative state
        readyNarrative.nextPostIndex++;
        readyNarrative.postsSinceLast = 0;
        readyNarrative.nextPostDelay = Math.floor(Math.random() * 4) + 2; // 2-5 posts

        // If arc is finished, remove it
        if (readyNarrative.nextPostIndex >= arcData.length) {
            activeNarratives = activeNarratives.filter(arc => arc.key !== readyNarrative.key);
        }
        return post;
    }

    // Chance to start a new narrative
    if (activeNarratives.length < 2 && availableNarrativeKeys.length > 0 && Math.random() < 0.15) {
        const newArcKey = getRandom(availableNarrativeKeys);
        availableNarrativeKeys = availableNarrativeKeys.filter(key => key !== newArcKey);
        
        activeNarratives.push({
            key: newArcKey,
            nextPostIndex: 0,
            postsSinceLast: -1, // Start delay on next post
            nextPostDelay: Math.floor(Math.random() * 3) // 0-2 posts initial delay
        });
    }

    return null; // No narrative post this time
}

function addToHistory(post) { postHistory.unshift(post); if (postHistory.length > MAX_POSTS) { postHistory.pop(); } }

function getUniquePost() {
    openLoops.forEach(loop => loop.followUpDelay--);

    // ✅ UPDATED: Prioritize narrative posts
    const narrativePost = generateNarrativePost();
    if (narrativePost) {
        if (!postHistory.some(p => p.content === narrativePost.content)) {
            addToHistory(narrativePost);
            return narrativePost;
        }
    }

    if (Math.random() < 0.25) {
        const followUp = generateFollowUpPost();
        if (followUp && !postHistory.some(p => p.content === followUp.content)) {
            addToHistory(followUp);
            return followUp;
        }
    }
    
    let post, attempts = 0;
    const maxAttempts = 50;
    do {
        post = fillPost();
        attempts++;

        const last10 = postHistory.slice(0, 10);
        const last8 = postHistory.slice(0, 8);
        const last5 = postHistory.slice(0, 5);
        const last12 = postHistory.slice(0, 12);

        if (last10.filter(p => p.author === post.author).length >= 3) continue;
        if (last8.filter(p => p.templateKey === post.templateKey).length >= 2) continue;
        if (last5.length === 5 && last5.filter(p => !p.isCustom).length < 2 && !post.isCustom) continue;
        if (post.topic && last12.some(p => p.topic === post.topic)) continue;
        if (last10.length > 1 && postHistory[0].tone === post.tone && postHistory[1].tone === post.tone) continue;
        if (postHistory.some(p => p.content === post.content)) continue;

        break;
    } while (attempts < maxAttempts);

    addToHistory(post);
    return post;
}


function showReactionToast(name, emoji) { const toastContainer = document.getElementById('toast-container'); const toast = document.createElement('div'); toast.className = 'toast bg-white p-3 rounded-lg shadow-lg text-sm flex items-center'; toast.innerHTML = `<span class="font-semibold mr-1">${name}</span> reacted with <span class="text-xl mx-1">${emoji}</span>`; toastContainer.appendChild(toast); setTimeout(() => { toast.remove(); }, 4000); }
function renderReactions(postContainer) { const reactionDisplay = postContainer.querySelector('.reaction-display'); const reactions = JSON.parse(postContainer.dataset.reactions || '{}'); const userEmoji = postContainer.dataset.userEmoji; reactionDisplay.innerHTML = ''; for (const [emoji, count] of Object.entries(reactions)) { if (count > 0) { const reactionSpan = document.createElement('span'); const isUserReaction = emoji === userEmoji; reactionSpan.className = `inline-block ${isUserReaction ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'} text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full`; reactionSpan.textContent = `${emoji} ${count}`; reactionDisplay.appendChild(reactionSpan); } } }
function handleUserReaction(event) { const button = event.currentTarget; const emoji = button.textContent; const postContainer = button.closest('.post-container'); if (!postContainer || postContainer.classList.contains('user-reacted')) { return; } postContainer.dataset.userEmoji = emoji; const reactions = JSON.parse(postContainer.dataset.reactions || '{}'); reactions[emoji] = (reactions[emoji] || 0) + 1; postContainer.dataset.reactions = JSON.stringify(reactions); renderReactions(postContainer); postContainer.classList.add('user-reacted'); const picker = postContainer.querySelector('.reaction-picker'); if (picker) { picker.style.display = 'none'; } }
function npcReactionEngine() { const allPosts = document.querySelectorAll('.post-container'); if (allPosts.length > 0) { const targetPost = getRandom(Array.from(allPosts)); if (targetPost.querySelector('.reaction-display').children.length < 6) { const reactorName = getRandom(knownChars).name; const postTone = targetPost.dataset.tone; let possibleReactions = toneReacts[postTone] || toneReacts.neutral; if (Math.random() < 0.02) { const allEmojis = ['👍', '😂', '😮', '🤔', '❤️', '😢']; possibleReactions = allEmojis; } const reactionEmoji = getRandom(possibleReactions); const reactions = JSON.parse(targetPost.dataset.reactions || '{}'); reactions[reactionEmoji] = (reactions[reactionEmoji] || 0) + 1; targetPost.dataset.reactions = JSON.stringify(reactions); renderReactions(targetPost); showReactionToast(reactorName, reactionEmoji); } } const nextReactionDelay = 5000 + Math.random() * 25000; reactionEngineTimeout = setTimeout(npcReactionEngine, nextReactionDelay); }
function postEngine() { const feedEl = document.getElementById('feed'); const postContainer = createPostElement(); feedEl.prepend(postContainer); postContainer.classList.add('new-post-animation'); if (feedEl.children.length > MAX_POSTS) { const oldestPost = feedEl.lastChild; feedEl.removeChild(oldestPost); } const nextPostDelay = 30000 + Math.random() * 60000; postEngineTimeout = setTimeout(postEngine, nextPostDelay); }

function createPostElement() {
    const post = getUniquePost();
    const postContainer = document.createElement('div');
    postContainer.className = 'post-container p-4';
    postContainer.dataset.reactions = '{}'; 
    postContainer.dataset.tone = post.tone; 
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'text-gray-800 text-sm mb-2';
    contentDiv.textContent = post.content;
    postContainer.appendChild(contentDiv);
    
    const footerDiv = document.createElement('div');
    footerDiv.className = 'flex items-center justify-between';
    
    const reactionDisplay = document.createElement('div');
    reactionDisplay.className = 'reaction-display flex-grow flex flex-wrap gap-1';
    footerDiv.appendChild(reactionDisplay);
    
    const reactionPicker = document.createElement('div');
    reactionPicker.className = 'reaction-picker space-x-1';
    
    const allEmojis = ['👍', '😂', '😮', '🤔', '❤️', '😢'];
    allEmojis.forEach(emoji => {
        const button = document.createElement('button');
        button.className = 'reaction-btn cursor-pointer p-1 rounded-full hover:bg-gray-200';
        button.textContent = emoji;
        button.onclick = handleUserReaction;
        reactionPicker.appendChild(button);
    });

    footerDiv.appendChild(reactionPicker);
    postContainer.appendChild(footerDiv);
    return postContainer;
}

function generatePosts() {
    if (reactionEngineTimeout) { clearTimeout(reactionEngineTimeout); }
    if (postEngineTimeout) { clearTimeout(postEngineTimeout); }
    
    postHistory = [];
    openLoops = [];
    activeNarratives = [];
    availableNarrativeKeys = Object.keys(narrativeArcs);

    const feedEl = document.getElementById('feed');
    feedEl.innerHTML = ''; 

    for (let i = 0; i < 10; i++) {
        const postElement = createPostElement();
        feedEl.appendChild(postElement);
    }
    
    npcReactionEngine();
    postEngine();
}

window.onload = generatePosts;