const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// === Parse natural-language math to standard math ===
function parseNaturalMath(expression){
    return expression.toLowerCase()
        .replace(/times|multiplied by|x|×/gi,'*')
        .replace(/plus/gi,'+')
        .replace(/minus/gi,'-')
        .replace(/divided by|over/gi,'/')
        .replace(/power of|to the power of/gi,'**')
        .replace(/\s+/g,'');
}

// === Evaluate direct math safely ===
function evaluateMath(expression){
    try{
        if(!/[0-9]/.test(expression)) return null;
        // eslint-disable-next-line no-eval
        const result = eval(parseNaturalMath(expression.replace(/[a-z]/gi,'')));
        return result;
    }catch{return null;}
}

// === Multi-step word problem solver ===
function solveWordProblem(sentence){
    const numbers = sentence.match(/\d+(\.\d+)?/g);
    if(!numbers) return null;
    const nums = numbers.map(Number);

    // Split sentence into phrases using commas or "then"
    const phrases = sentence.toLowerCase().split(/,|then/);

    let result = null;
    for(let phrase of phrases){
        const numsInPhrase = phrase.match(/\d+(\.\d+)?/g);
        if(!numsInPhrase) continue;
        const numsP = numsInPhrase.map(Number);
        if(result===null) result = numsP[0];

        // Detect operation keywords
        let op = null;
        if(/add|plus|gave|more|increase|received/.test(phrase)) op='+';
        else if(/subtract|minus|ate|lose|lost|decrease/.test(phrase)) op='-';
        else if(/times|multiplied|product/.test(phrase)) op='*';
        else if(/divide|divided|per/.test(phrase)) op='/';

        for(let i=1;i<numsP.length;i++){
            if(op==='+') result += numsP[i];
            else if(op==='-') result -= numsP[i];
            else if(op==='*') result *= numsP[i];
            else if(op==='/') result /= numsP[i];
            else result += numsP[i]; // default add if unknown
        }
    }
    return result;
}

// === AI dynamic response generation ===
function generateAIResponse(message){
    const msg = message.toLowerCase().trim();

    // 1️⃣ Direct questions
    if(msg.endsWith('?')){
        if(msg.includes("name")) return "I am MathAI Pro, your AI tutor!";
        if(msg.includes("time")) return `It's currently ${new Date().toLocaleTimeString()}.`;
        if(msg.includes("how are you")) return "I'm feeling fantastic! Ready to solve any problem you give me.";
        return "Interesting question! I might also be able to calculate numbers from it.";
    }

    // 2️⃣ Casual / short responses
    const casualResponsesMap = {
        hello: ["Hey there! How's it going?", "Hello! Need help with some math or just chatting?", "Hi! I'm ready for any question or calculation."],
        hi: ["Hey! How's it going?", "Hello there! Need help with math or just chatting?", "Hi! Ready for any question or calculation."],
        thanks: ["You're welcome! 😊", "No problem, happy to help!", "Anytime! Glad I could assist."],
        "thank you": ["You're welcome! 😊", "No problem, happy to help!", "Anytime! Glad I could assist."],
        yes: ["Got it!", "Alright!", "Cool!"],
        no: ["Okay!", "No worries.", "Alright, noted."],
        maybe: ["Hmm… maybe!", "Could be!", "I see!"]
    };

    for(let key in casualResponsesMap){
        if(msg === key){
            const responses = casualResponsesMap[key];
            return responses[Math.floor(Math.random()*responses.length)];
        }
    }

    // 3️⃣ Multi-step word problem
    const wordResult = solveWordProblem(msg);
    if(wordResult!==null) return `Based on what you said, the result is ${wordResult}.`;

    // 4️⃣ Direct math evaluation
    const mathResult = evaluateMath(msg);
    if(mathResult!==null) return `The answer is ${mathResult}.`;

    // 5️⃣ Fallback dynamic response
    const fallback = [
        "Hmm… I'm not sure about that, but I can help with numbers!",
        "Interesting! I might not fully understand, but I can solve math problems.",
        "I can chat or calculate numbers. What would you like to do?"
    ];
    return fallback[Math.floor(Math.random()*fallback.length)];
}

// === Add message to chat box ===
function addMessage(text, sender){
    const div = document.createElement("div");
    div.className = `message ${sender}`;
    div.textContent = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// === Send message handler ===
function sendMessage(){
    const msg = userInput.value.trim();
    if(!msg) return;
    addMessage(msg,'user');
    userInput.value = "";

    setTimeout(()=>{
        const aiResp = generateAIResponse(msg);
        addMessage(aiResp,'ai');
    }, 500 + Math.random()*500); // human-like thinking delay
}

// === Event listeners ===
sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", e=>{
    if(e.key==='Enter') sendMessage();
});
