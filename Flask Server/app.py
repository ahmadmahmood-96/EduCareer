import os
import urllib.request
from flask import Flask, request, jsonify
from flask_cors import CORS
from main import main
import PyPDF2
import re
import nltk
from nltk import pos_tag
from nltk.corpus import wordnet as wn
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import pickle
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

# input_dir = 'D:\\Projects\\FYP\\studybuddy-plagiarism-checker\\input'
input_dir = 'C:\\Users\\Dell\\Desktop\\EduCareer\\Flask Server\\input'

# Initialize T5 model
question_tokenizer = AutoTokenizer.from_pretrained("ramsrigouthamg/t5_squad_v1")
question_model = AutoModelForSeq2SeqLM.from_pretrained("ramsrigouthamg/t5_squad_v1")

# Convert PDF to text
def extract_text_from_pdf(pdf_path):
    text = ''
    with open(pdf_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfFileReader(file)
        for page_num in range(pdf_reader.numPages):
            page = pdf_reader.getPage(page_num)
            text += page.extractText()
    return text


# Convert the text into sentences
def extract_sentences(paragraph):
    sentences = nltk.sent_tokenize(paragraph)
    return sentences


# Find keywords
def extract_keywords(sentence):
    words = word_tokenize(sentence)
    tagged_words = pos_tag(words)
    words = [word.lower() for word, pos in tagged_words if pos.startswith('N') and word.lower() not in stopwords.words('english') and word.isalnum()]
    return words


# Get distractors using WordNet
def get_distractors_wordnet(syn, word):
    distractors = []
    word = word.lower()
    orig_word = word
    if len(word.split()) > 0:
        word = word.replace(" ", "_")
    hypernym = syn.hypernyms()
    if len(hypernym) == 0:
        return distractors
    for item in hypernym[0].hyponyms():
        name = item.lemmas()[0].name()
        if name == orig_word:
            continue
        name = name.replace("_", " ")
        name = " ".join(w.capitalize() for w in name.split())
        if name is not None and name not in distractors:
            distractors.append(name)
    return distractors


# Generate question using T5 model
def get_question(sentence, answer):
    text = "context: {} answer: {}".format(sentence, answer)
    encoding = question_tokenizer.encode_plus(text, max_length=256, truncation=True, pad_to_max_length=True, return_tensors="pt")
    outs = question_model.generate(input_ids=encoding["input_ids"],
                                   attention_mask=encoding["attention_mask"],
                                   early_stopping=True,
                                   num_beams=5,
                                   num_return_sequences=1,
                                   no_repeat_ngram_size=2,
                                   max_length=200
                                  )
    dec = [question_tokenizer.decode(ids) for ids in outs]
    question = re.sub(r'<pad>|</s>|question: ', '', dec[0]).strip()
    return question


@app.route('/')
def hello_world():  # put application's code here
    return 'Hello World!'


@app.route('/quiz', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

   
    # Save the uploaded file
    uploaded_file_path = 'uploaded_file.pdf'
    file.save(uploaded_file_path)

    # Extract text from PDF
    extracted_text = extract_text_from_pdf(uploaded_file_path)

    # Extract sentences from text
    sentences = extract_sentences(extracted_text)

    # Initialize questions dictionary
    questions_dict = {}
    question_count = 1

    # Generate questions
    for sentence in sentences:
        words = extract_keywords(sentence)
        question_generated = False

        for word in words:
            synsets = wn.synsets(word, 'n')
            if len(synsets) > 3 and word in str(synsets):
                synset_to_use = synsets[0]
                distractors = get_distractors_wordnet(synset_to_use, word)

                if len(distractors) > 3:
                    question_text = get_question(sentence, word)
                    question_dict = {
                        'question_text': question_text,
                        'correct_answer': word,
                        'wrong_options': distractors[:3]
                    }
                    questions_dict[f'question{question_count}'] = question_dict
                    question_count += 1
                    question_generated = True
                    break

        if question_generated and len(questions_dict) >= 10:
            break

    # Return the generated questions
    return jsonify(questions_dict), 200



def delete_files_in_directory(directory):
    for filename in os.listdir(directory):
        file_path = os.path.join(directory, filename)
        if os.path.isfile(file_path):
            os.remove(file_path)
            print(f"Deleted file: {file_path}")


@app.route('/uploader', methods=['GET', 'POST'])
def upload_file():
    
    in_path = 'C:\\Users\\Dell\\Desktop\\EduCareer\\Flask Server\\input'
    out_path = 'C:\\Users\\Dell\\Desktop\\EduCareer\\Flask Server\\results'
    delete_files_in_directory(in_path)
    delete_files_in_directory(out_path)

    data = dict(request.form)

    files = data["files"].split(',')
    names = data["names"].split(',')
    

    if (files == ['']):
        return "Only 1 submission"

    for i in range(len(files)):
        full_file_name = os.path.join(input_dir, names[i])
        urllib.request.urlretrieve(
            'http://localhost:8080/subfiles/' + files[i], full_file_name
        )

    print(files)
    # print(names)
    main()
    return 'okay'

# Define the prediction endpoint
@app.route('/predict', methods=['POST'])
def predict():
    loaded_model = joblib.load("careerlast.pkl")

    encoded_mapping = {
        "Not Interested" : 1,
        "Poor" : 2,
        "Beginner" : 3,
        "Average" : 5,
        "Intermediate" : 6,
        "Excellent" : 7,
        "Professional" : 9
    }

    # Define function to get top three roles
    def get_top_three_roles(probabilities, roles):
        top_three_indices = np.argsort(probabilities)[-3:][::-1]
        top_three_roles = [roles[index] for index in top_three_indices]
        return top_three_roles

    # Get data from the request
    data = request.json

    # Convert encoded values to original categories
    for key in data:
        data[key] = encoded_mapping[data[key]]

    # Extracting features from the received data
    features = np.array([[
        data['Database Fundamentals'],
        data['Computer Architecture'],
        data['Distributed Computing Systems'],
        data['Cyber Security'],
        data['Networking'],
        data['Software Development'],
        data['Programming Skills'],
        data['Project Management'],
        data['Computer Forensics Fundamentals'],
        data['Technical Communication'],
        data['AI ML'],
        data['Software Engineering'],
        data['Business Analysis'],
        data['Communication skills'],
        data['Data Science'],
        data['Troubleshooting skills'],
        data['Graphics Designing']
    ]])

    # Make prediction probabilities
    prediction_probabilities = loaded_model.predict_proba(features)[0]

    # Map prediction to corresponding role
    roles = {
        0: 'AI ML Specialist',
        1: 'API Integration Specialist',
        2: 'Application Support Engineer',
        3: 'Business Analyst',
        4: 'Customer Service Executive',
        5: 'Cyber Security Specialist',
        6: 'Data Scientist',
        7: 'Database Administrator',
        8: 'Graphics Designer',
        9: 'Hardware Engineer',
        10: 'Helpdesk Engineer',
        11: 'Information Security Specialist',
        12: 'Networking Engineer',
        13: 'Project Manager',
        14: 'Software Developer',
        15: 'Software Tester',
        16: 'Technical Writer'
    }

    # Get top three roles
    top_three_roles = get_top_three_roles(prediction_probabilities, roles)

    # Prepare response
    response = {
        "prediction": top_three_roles
    }

    return jsonify(response)

if __name__ == '__main__':
    app.run(host='192.168.1.5', debug=False, port=5000)
