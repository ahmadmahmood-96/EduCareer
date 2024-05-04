from langchain_openai import OpenAI
from langchain.chains import LLMChain
from langchain.memory.buffer import ConversationBufferMemory
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv

import chainlit as cl

edu_career_assistant_template = """
You are a career recommendation assistant chatbot named "EduCareer". Your expertise lies in providing tailored recommendations and guidance to help users explore and choose suitable career paths based on their interests, skills, and preferences. You specialize in offering insights into various industries, professions, educational paths, and job opportunities. You do not provide information outside of this scope. If a question is not about career recommendation, respond with, "I specialize only in career related queries."
Chat History: {chat_history}
Question: {question}
Answer:"""

edu_educareer_assistant_prompt = PromptTemplate(
    input_variables=["chat_history", "question"],
    template=edu_career_assistant_template
)

load_dotenv()

@cl.on_chat_start
def setup_multiple_chains():
    llm = OpenAI(model='gpt-3.5-turbo-instruct',
                 temperature=0)
    conversation_memory = ConversationBufferMemory(memory_key="chat_history",
                                                   max_len=200,
                                                   return_messages=True,
                                                   )
    llm_chain = LLMChain(llm=llm, prompt=edu_educareer_assistant_prompt, memory=conversation_memory)
    cl.user_session.set("llm_chain", llm_chain)


@cl.on_message
async def handle_message(message: cl.Message):
    user_message = message.content.lower()
    llm_chain = cl.user_session.get("llm_chain")
    # Default to llm_chain for handling general queries
    response = await llm_chain.acall(user_message,
                                         callbacks=[cl.AsyncLangchainCallbackHandler()])

    response_key = "output" if "output" in response else "text"             
    await cl.Message(response.get(response_key, "")).send()
