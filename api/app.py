# Import required FastAPI components for building the API
from fastapi import FastAPI, HTTPException, UploadFile
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware

# Import Pydantic for data validation and settings management
from pydantic import BaseModel

# Import OpenAI client for interacting with OpenAI's API
from openai import OpenAI
from typing import Optional
import tempfile
from pathlib import Path

# Import RAG components from aimakerspace
from aimakerspace.text_utils import PDFLoader, CharacterTextSplitter
from aimakerspace.openai_utils.embedding import EmbeddingModel
from aimakerspace.vectordatabase import VectorDatabase

"""
Backend API for the AI Chat Application

This FastAPI application provides endpoints for:
1. Chat completions with streaming responses
2. Health checks for monitoring

Key Technologies:
- FastAPI: Modern, fast web framework for building APIs
- OpenAI API: For LLM chat completions
- Pydantic: Data validation and serialization
- CORS: Cross-Origin Resource Sharing for frontend access
- Streaming: Real-time response delivery

This is currently a simple chat API, but it's designed to be extended
with RAG functionality using the aimakerspace package.
"""

# Initialize FastAPI application with a title
app = FastAPI(
    title="OpenAI Chat API",
    description="A FastAPI backend for AI chat applications with streaming support",
    version="1.0.0",
)

# Configure CORS (Cross-Origin Resource Sharing) middleware
# This allows the API to be accessed from different domains/origins
# CRITICAL for frontend-backend communication!
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*"
    ],  # Allows requests from any origin (use specific domains in production)
    allow_credentials=True,  # Allows cookies to be included in requests
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allows all headers in requests
)

# Global RAG components - initialized when first PDF is uploaded
vector_database = None
embedding_model = None


# Define the data model for chat requests using Pydantic
# This ensures incoming request data is properly validated and typed
class ChatRequest(BaseModel):
    """
    Data model for chat completion requests.

    Pydantic automatically validates that incoming JSON matches this structure
    and converts it to a Python object with proper types.

    Python Concepts:
    - Pydantic BaseModel: Automatic validation and serialization
    - Type hints: Explicit types for each field
    - Optional fields: Can be omitted in requests
    - Default values: Fallback values if not provided
    """

    developer_message: str  # System/developer instructions (maps to "system" role)
    user_message: str  # User's question or input (maps to "user" role)
    model: Optional[str] = (
        "gpt-4o-mini"  # OpenAI model to use (corrected from gpt-4.1-mini)
    )
    api_key: str  # OpenAI API key for authentication

    class Config:
        """Pydantic configuration for the model."""

        # Example of what a valid request looks like (updated for Pydantic V2)
        json_schema_extra = {
            "example": {
                "developer_message": "You are a helpful AI assistant.",
                "user_message": "What is machine learning?",
                "model": "gpt-4o-mini",
                "api_key": "sk-...",
            }
        }


# Define the main chat endpoint that handles POST requests
@app.post("/api/chat")
async def chat(request: ChatRequest):
    """
    Main chat completion endpoint with streaming support.

    This endpoint:
    1. Accepts a chat request with system and user messages
    2. Validates the request data using Pydantic
    3. Creates an OpenAI client with the provided API key
    4. Streams the response back in real-time

    Args:
        request (ChatRequest): Validated request data from the client

    Returns:
        StreamingResponse: Real-time streaming text response

    HTTP Details:
        - Method: POST
        - Path: /api/chat
        - Content-Type: application/json (input)
        - Content-Type: text/plain (output, streaming)

    Future RAG Enhancement:
        This endpoint can be extended to:
        1. Extract relevant documents based on user_message
        2. Include retrieved documents in developer_message
        3. Generate context-aware responses
    """
    try:
        # Initialize OpenAI client with the provided API key
        # Each request uses its own API key for security
        client = OpenAI(api_key=request.api_key)

        # Perform RAG retrieval if vector database is available
        enhanced_developer_message = request.developer_message
        global vector_database, embedding_model

        if vector_database is not None and embedding_model is not None:
            # Get embedding for user's question
            query_embedding = await embedding_model.async_get_embedding(
                request.user_message
            )

            # Retrieve relevant chunks from vector database
            relevant_chunks = vector_database.search(query_embedding, k=3)

            # Create context from retrieved chunks
            if relevant_chunks:
                context = "\n\n".join(
                    [chunk[0] for chunk in relevant_chunks]
                )  # chunk[0] is the text, chunk[1] is the score
                enhanced_developer_message = f"""{request.developer_message}

CONTEXT FROM UPLOADED DOCUMENT:
{context}

Please answer the user's question based ONLY on the information provided in the context above. If the answer is not in the context, please say "I don't have that information in the uploaded document."
"""

        # Create an async generator function for streaming responses
        async def generate():
            """
            Inner generator function that yields response chunks.

            This function handles the streaming logic:
            1. Creates a streaming chat completion request
            2. Processes each chunk as it arrives
            3. Yields content to the client in real-time

            Python Concepts:
            - Nested function: Function defined inside another function
            - Generator: Uses yield to produce values incrementally
            - Streaming: Processes data as it arrives, not all at once
            """
            # Create a streaming chat completion request
            stream = client.chat.completions.create(
                model=request.model,
                messages=[
                    # System message: Instructions for how the AI should behave (enhanced with RAG context)
                    {"role": "system", "content": enhanced_developer_message},
                    # User message: The actual question or input
                    {"role": "user", "content": request.user_message},
                ],
                stream=True,  # Enable streaming response (chunks arrive incrementally)
            )

            # Yield each chunk of the response as it becomes available
            for chunk in stream:
                # Check if this chunk contains actual content (not just metadata)
                if chunk.choices[0].delta.content is not None:
                    yield chunk.choices[0].delta.content

        # Return a streaming response to the client
        # This allows the frontend to display text as it's generated
        return StreamingResponse(generate(), media_type="text/plain")

    except Exception as e:
        # Handle any errors that occur during processing
        # This could be API key issues, network problems, etc.
        raise HTTPException(status_code=500, detail=str(e))


# Define a health check endpoint to verify API status
@app.get("/api/health")
async def health_check():
    """
    Health check endpoint for monitoring and load balancers.

    This simple endpoint allows external services to verify that:
    1. The API server is running
    2. The application is responsive
    3. Basic functionality is working

    Returns:
        dict: Simple status response

    HTTP Details:
        - Method: GET
        - Path: /api/health
        - Response: {"status": "ok"}

    Usage:
        - Monitoring systems can ping this endpoint
        - Load balancers can use it for health checks
        - Deployment systems can verify successful deploys
    """
    return {"status": "ok", "message": "Chat API is running"}


@app.post("/api/upload-pdf")
async def upload_pdf(file: UploadFile):
    """
    Process uploaded PDF files for RAG functionality.

    This endpoint:
    1. Validates the uploaded file is a PDF
    2. Temporarily saves the file to disk
    3. Uses PDFLoader to extract text content
    4. Uses CharacterTextSplitter to create chunks
    5. Returns processing results

    Args:
        file (UploadFile): The uploaded PDF file from the frontend

    Returns:
        dict: Processing results with chunks and metadata
    """
    # Validate file type
    if not file.content_type == "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    try:
        # Create a temporary file to save the uploaded PDF
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
            # Read and save the uploaded file content
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name

        # Process the PDF using our RAG components
        pdf_loader = PDFLoader(temp_file_path)
        documents = pdf_loader.load_documents()

        # Split the document into chunks for RAG
        text_splitter = CharacterTextSplitter()
        chunks = text_splitter.split_texts(documents)

        # Clean up the temporary file
        Path(temp_file_path).unlink()

        # Initialize RAG components if not already done
        global vector_database, embedding_model
        if embedding_model is None:
            embedding_model = EmbeddingModel()

        # Create embeddings for all chunks
        embeddings = []
        for chunk in chunks:
            embedding = await embedding_model.async_get_embedding(chunk)
            embeddings.append(embedding)

        # Initialize or reset vector database with new document
        vector_database = VectorDatabase()

        # Add all chunks and embeddings to vector database
        for chunk, embedding in zip(chunks, embeddings):
            vector_database.insert(chunk, embedding)

        return {
            "status": "success",
            "filename": file.filename,
            "num_documents": len(documents),
            "num_chunks": len(chunks),
            "num_embeddings": len(embeddings),
            "message": f"Successfully processed {file.filename} and created RAG database",
        }

    except Exception as e:
        # Clean up temp file if it exists
        if "temp_file_path" in locals():
            Path(temp_file_path).unlink(missing_ok=True)

        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")


# Entry point for running the application directly
if __name__ == "__main__":
    """
    Development server startup.
    
    This block only runs when the script is executed directly
    (not when imported as a module).
    
    Python Concepts:
    - __name__ == "__main__": Checks if script is run directly
    - Uvicorn: ASGI server for running FastAPI applications
    - Host binding: 0.0.0.0 allows connections from any IP
    - Port configuration: 8000 is the default development port
    
    For production, use a proper ASGI server like:
    - uvicorn api.app:app --host 0.0.0.0 --port 8000
    - gunicorn -w 4 -k uvicorn.workers.UvicornWorker api.app:app
    """
    import uvicorn

    # Start the development server
    # Note: reload=False to avoid the import string warning when running directly
    uvicorn.run(
        app,
        host="0.0.0.0",  # Accept connections from any IP address
        port=8000,  # Listen on port 8000
        reload=False,  # Disabled when running directly to avoid warnings
    )
