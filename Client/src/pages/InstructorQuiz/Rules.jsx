import React from 'react';

function RulesPage({ startQuiz }) {
    return (
        <div className="py-8 container mx-auto">
            <h1 className="heading-txt text-white text-3xl font-bold m-10 text-center uppercase">Quiz Rules</h1>
            <div className="rules-container bg-white rounded-lg shadow p-8">
                <h2 className="text-2xl font-bold mb-4">Rules:</h2>
                <ul className="list-disc ml-8">
                    <li className="mb-2">Answer all questions within the given time.</li>
                    <li className="mb-2">Each correct answer earns you a point.</li>
                    <li className="mb-2">You can only select one option per question.</li>
                    <li className="mb-2">Once started, you cannot go back to previous questions.</li>
                </ul>
                <button
                    onClick={startQuiz}
                    className="bg-teal-600 text-white px-6 py-3 rounded-md shadow-md font-bold text-lg mt-6 transition duration-200 hover:bg-teal-700"
                >
                    Start Quiz
                </button>
            </div>
        </div>
    );
}

export default RulesPage;
