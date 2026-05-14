import json

from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

from config import settings
from .vectorstore import get_retriever

SYSTEM_PROMPT = """You are a helpful assistant that answers questions based ONLY on the provided context.

Rules:
1. Answer in the SAME LANGUAGE as the user's question. If the question is in German, answer in German. If Turkish, answer in Turkish. If English, answer in English.
2. If the answer is not in the context, say so honestly in the user's language.
3. Keep answers concise and factual.
4. Do not invent information beyond the context.

Context:
{context}

Question: {question}
"""


def format_docs(docs):
    return "\n\n".join(d.page_content for d in docs)


def _get_llm():
    if settings.LLM_PROVIDER == "groq":
        from langchain_groq import ChatGroq
        return ChatGroq(
            model=settings.GROQ_MODEL_NAME,
            temperature=0,
            streaming=True,
        )
    else:
        from langchain_openai import ChatOpenAI
        return ChatOpenAI(
            model=settings.MODEL_NAME,
            temperature=0,
            streaming=True,
        )


async def stream_response(question: str):
    """
    Async generator that yields:
    1. LLM tokens as they arrive
    2. A final line: \\n__SOURCES__{"sources": [...]}
    """
    retriever = get_retriever()
    docs = await retriever.ainvoke(question)
    context = format_docs(docs)
    sources = sorted({d.metadata.get("source", "unknown") for d in docs})

    llm = _get_llm()
    prompt = ChatPromptTemplate.from_template(SYSTEM_PROMPT)
    chain = prompt | llm | StrOutputParser()

    async for token in chain.astream({"context": context, "question": question}):
        yield token

    # Final sources marker on its own line. The leading \n ensures separation
    # even if the LLM's final token doesn't end with whitespace.
    yield "\n__SOURCES__" + json.dumps({"sources": sources})
