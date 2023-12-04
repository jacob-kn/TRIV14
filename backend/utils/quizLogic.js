const quizSessions = new Map();
const POINTS_PER_CORRECT_ANSWER = 1;

function startQuiz(io, quiz, roomCode, duration, hostId) {
    let currentQuestion = 0;
    let scores = {};

    function nextQuestion() {
        currentQuestion++;

        if (currentQuestion < quiz.questions.length) {
            const fullQuestion = quiz.questions[currentQuestion];
            const questionToSend = {
                type: fullQuestion.type,
                question: fullQuestion.question,
                options: fullQuestion.options.map(option => ({ text: option.text }))
            };

            io.to(roomCode).emit('newQuestion', questionToSend);

            // Set a timeout to emit the correct answer after the question duration
            setTimeout(() => {
                const correctOption = fullQuestion.options.find(option => option.isCorrect);
                io.to(roomCode).emit('correctAnswer', correctOption.text); // Emit only the text of the correct option
            }, duration);

        } else {
            // End of the quiz
            io.to(roomCode).emit('quizEnded', scores);
        }
    }

    nextQuestion() // starting the quiz off

    // Store the quiz session information
    quizSessions.set(roomCode, { quiz, currentQuestion, scores, nextQuestion, hostId });
}

function handleAnswer(socketId, submittedAnswer, roomCode) {
    const session = quizSessions.get(roomCode);
    const currentQuestion = session.quiz.questions[session.currentQuestion];

    if (currentQuestion) {
        const correctOption = currentQuestion.options.find(option => option.isCorrect);
        if (correctOption && correctOption.text === submittedAnswer) {
            session.scores[socketId] = (session.scores[socketId] || 0) + POINTS_PER_CORRECT_ANSWER;
        }
    }
}

function handleNextQuestion(socketId, roomCode) {
    const session = quizSessions.get(roomCode);
    if (session && session.hostId === socketId) { // verfying its the host doing this event
        session.nextQuestion();
    }
}


export { startQuiz, handleAnswer, handleNextQuestion };