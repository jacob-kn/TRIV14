const quizSessions = new Map();
const POINTS_PER_CORRECT_ANSWER = 1;

function startQuiz(io, quiz, roomCode, duration, hostId) {
    let currentQuestion = 0;
    let scores = {};

    function nextQuestion() {
        io.to(roomCode).fetchSockets().then(sockets => {
            sockets.forEach((socket) => {
                if (!scores[socket.id] && socket.id != hostId) {
                    scores[socket.id] = 0; // Setting initial scores to 0
                }
            });
            
            
            if (currentQuestion < quiz.questions.length) {
                const fullQuestion = quiz.questions[currentQuestion];
                const questionToSend = {
                    title: quiz.title,
                    type: fullQuestion.type,
                    question: fullQuestion.question,
                    options: fullQuestion.options.map(option => ({ text: option.text }))
                };
                
                io.to(roomCode).emit('newQuestion', questionToSend);
                
                // Set a timeout to emit the correct answer after the question duration
                setTimeout(() => {
                    const correctOptions = fullQuestion.options.filter(option => option.isCorrect);
                    io.to(roomCode).emit('correctAnswer', correctOptions.map(option => option.text));
                }, duration * 1000 + 1000);
            } 

            quizSessions.set(roomCode, { quiz, currentQuestion, scores, nextQuestion, hostId });
            currentQuestion++;

            if (currentQuestion > quiz.questions.length) {
                io.to(roomCode).emit('quizEnded', scores);
            }
                
        }).catch(err => {
            console.error("Error fetching sockets in room:", err); //TODO: Close room
        });
    }
    
    nextQuestion() // starting the quiz off
    
    
    // Store the quiz session information
    // quizSessions.set(roomCode, { quiz, currentQuestion, scores, nextQuestion, hostId });
}

function handleAnswer(socketId, submittedAnswer, roomCode) {
    console.log("sub ans: " + submittedAnswer);
    const session = quizSessions.get(roomCode);
    console.log("index " + session.currentQuestion);
    const currentQuestion = session.quiz.questions[session.currentQuestion];

    if (currentQuestion) {
        // console.log(currentQuestion.options);
        const isCorrect = currentQuestion.options.some(
                option => option.isCorrect && option.text == submittedAnswer // Arrow function (structure is kind of like Haskell)
            );
        if (isCorrect) {
            console.log("IsCorrect");
            session.scores[socketId] = (session.scores[socketId] || 0) + POINTS_PER_CORRECT_ANSWER; // updating score
        }
    }
}

function handleNextQuestion(io, socketId, roomCode) {
    const session = quizSessions.get(roomCode);
    if (session && session.hostId === socketId) { // verfying its the host doing this event

        const participantScores = session.scores;
        console.log(participantScores);

        // Send each participant their current score
        for (let id in participantScores) {
            console.log("emiting update score (backend)");
            const score = participantScores[id];
            io.to(id).emit('updateScore', score);
        }

        session.nextQuestion();
    }
}


export { startQuiz, handleAnswer, handleNextQuestion };