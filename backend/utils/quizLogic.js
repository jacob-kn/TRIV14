const quizSessions = new Map();
const POINTS_PER_CORRECT_ANSWER = 1;

function startQuiz(io, quiz, roomCode, duration, hostId) {
    let currentQuestion = -1;
    let scores = {};

    function nextQuestion() {
        io.to(roomCode).sockets.forEach((socket) => {
            if(!scores[socket.id]){
                scores[socket.id] = 0 // Setting initial scores to 0
            }
        });
        currentQuestion++;

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
                const correctOption = fullQuestion.options.find(option => option.isCorrect);
                io.to(roomCode).emit('correctAnswer', correctOption.text); // Emit only the text of the correct option
            }, duration * 1000 + 1000);

        } else {
            // End of the quiz
            io.to(roomCode).emit('quizEnded', scores);
        }
    }

    nextQuestion() // starting the quiz off

    // Store the quiz session information
    quizSessions.set(roomCode, { quiz, currentQuestion, scores, nextQuestion, hostId });
}

function handleAnswer(io, socketId, submittedAnswer, roomCode) {
    console.log("handling answers for roomcode: " + roomCode);
    const session = quizSessions.get(roomCode);
    console.log(session);
    const currentQuestion = session.quiz.questions[session.currentQuestion];

    if (currentQuestion) {
        const correctOption = currentQuestion.options.find(option => option.isCorrect);
        if (correctOption && correctOption.text === submittedAnswer) {
            session.scores[socketId] = (session.scores[socketId] || 0) + POINTS_PER_CORRECT_ANSWER;
        }
    }
}

function handleNextQuestion(io, socketId, roomCode) {
    const session = quizSessions.get(roomCode);
    if (session && session.hostId === socketId) { // verfying its the host doing this event

        const participantScores = session.scores;

        // Send each participant their current score
        for (let id in participantScores) {
            const score = participantScores[id];
            io.to(id).emit('updateScore', score);
        }

        session.nextQuestion();
    }
}


export { startQuiz, handleAnswer, handleNextQuestion };