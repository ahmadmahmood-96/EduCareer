import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QuizResult from './Result';
import { QuizData } from './Questions';
import RulesPage from './Rules'; 


function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const Quiz =()=> {
    const [showRules, setShowRules] = useState(true); 
    const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [clickedOption, setClickedOption] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [timer, setTimer] = useState(0); // Timer state
    const [shuffledQuizData, setShuffledQuizData] = useState([]);
    const [showLoginButton, setShowLoginButton] = useState(false);
    const [showHomeButton, setShowHomeButton] = useState(false);

   

    const startQuiz = () => {
        setShowRules(false); // Hide rules and start the quiz
        setTimer(50);
        setShowResult(false);
    };

    useEffect(() => {
        if (!showResult) {
            const shuffledCategories = QuizData.map((category) => ({
                name: category.name,
                questions: shuffle(category.questions).slice(0, 2),
            }));
            setShuffledQuizData(shuffledCategories);
            setCurrentQuestionIndex(0);
            setCurrentCategoryIndex(0);
            setScore(0);
            setClickedOption(0);
        }
    }, [showResult]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (timer > 0 && !showResult) {
                setTimer((prevTimer) => prevTimer - 1);
            } 
            else if (timer === 0 && !showResult) {
                setShowResult(true);
            }
            else if (showResult){
                
                 // Submit quiz score to the backend
                 const userId = localStorage.getItem("id");
                 console.log(score)
                 axios.post('http://localhost:8080/api/users/submit-quiz-score', { userId, score })
                     .then((response) => {
                     console.log("Quiz score submitted successfully:", response.data.message);
                     })
                     .catch((error) => {
                     console.error("Error submitting quiz score:", error);
                     });

                     navigateBasedOnScore();

                     clearInterval(interval); // Clear interval when timer reaches 0 or showResult becomes true

            }
        }, 1000);

        // Clear interval on component unmount
        return () => clearInterval(interval);
    }, [timer, ]); // Depend on timer, showResult, currentCategoryIndex, and shuffledQuizData

    

    const navigateBasedOnScore = () => {
        const userId = localStorage.getItem("id");
        // Fetch user's score from the database
        axios.get(`http://localhost:8080/api/users/score/${userId}`)
            .then((response) => {

                const userScore = response.data.score;
                console.log("Score from db", userScore)
                const percentageScore = (userScore / (shuffledQuizData.length * 2)) * 100;
    
                // Determine navigation based on percentage score
                if (percentageScore >= 60) {
                    setShowLoginButton(true);
                } else {
                    setShowHomeButton(true);
                }
            })
            .catch((error) => {
                console.error("Error fetching user score:", error);
            });
    };
    
    // useEffect(() => {
    //     if (showResult) {
    //         navigateBasedOnScore();
    //     }
    // }, [showResult]);

    const handleNextCategory = () => {
        if (currentCategoryIndex < shuffledQuizData.length - 1) {
            setCurrentCategoryIndex((prevIndex) => prevIndex + 1);
            setCurrentQuestionIndex(0);
            setClickedOption(0);
        } else {
            setShowResult(true);
            // navigateBasedOnScore();
        }
    };

    const changeQuestion = () => {
        updateScore();
        if (currentQuestionIndex < shuffledQuizData[currentCategoryIndex].questions.length - 1 && !showResult) {
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
            setClickedOption(0);
        } else {
            handleNextCategory();
        }
    };

    const updateScore = () => {
        const currentQuestion = shuffledQuizData[currentCategoryIndex].questions[currentQuestionIndex];
        if (clickedOption !== 0 && clickedOption === currentQuestion.answer) {
            setScore((prevScore) => prevScore + 1)
        }
    };

    const resetAll = () => {
        setShowResult(false);
        setCurrentCategoryIndex(0);
        setCurrentQuestionIndex(0);
        setClickedOption(0);
        setScore(0);
        setTimer(50); 
        
    };



    return (
        <div className='container mx-auto'>
            {showRules ? (
                <RulesPage startQuiz={startQuiz} />
            ) : (
                <>
                    <p className="heading-txt text-white text-3xl font-bold m-10 text-center uppercase">Quiz APP</p>
                    <div className="container flex items-center flex-col min-h-400 w-400 bg-white rounded-lg shadow overflow-hidden relative">
                        {showResult ? (
                           <div>
                           <QuizResult
                               score={score}
                               totalScore={shuffledQuizData.length * 2}
                               showLoginButton={showLoginButton}
                               showHomeButton={showHomeButton}
                           />
                       </div>
                        ) : (
                            <>
                                <p className="category-txt">{shuffledQuizData[currentCategoryIndex]?.name}</p>
                                <div className="timer absolute top-0 right-0 p-4 text-lg font-bold text-purple-600">
                                    Time Remaining: {Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
                                </div>
                                <div className="question bg-white shadow-md rounded-lg px-5 py-3 font-bold font-serif text-lg min-w-full min-h-90 flex justify-center items-center m-8">
                                    <span id="question-number" className="mr-5">{currentQuestionIndex + 1}. </span>
                                    <span id="question-txt">{shuffledQuizData[currentCategoryIndex]?.questions[currentQuestionIndex]?.question}</span>
                                </div>
                                <div className="option-container flex flex-col m-4 p-10 w-full">
                                    {shuffledQuizData[currentCategoryIndex]?.questions[currentQuestionIndex]?.options.map((option, i) => {
                                        return (
                                            <button
                                                className={`option-btn shadow-md px-5 py-2 rounded-md border-none outline-none transition duration-300 m-5 min-h-30 ${clickedOption === i + 1 ? 'bg-purple-600 text-white' : 'bg-white'}`}
                                                key={i}
                                                onClick={() => setClickedOption(i + 1)}
                                            >
                                                {option}
                                            </button>
                                        );
                                    })}
                                </div>
                                <button
                                    type="button"
                                    className="bg-purple-600 text-white px-10 py-4 rounded-md shadow-md transition duration-200 font-bold text-lg"
                                    onClick={changeQuestion}
                                >
                                    Next
                                </button>
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default Quiz;
