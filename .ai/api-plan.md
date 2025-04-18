# REST API Plan for TedCards

## 1. Resources

- **Users** - Maps to `users` table (managed by Supabase Auth)
- **Flashcards** - Maps to `flashcards` table
- **Generations** - Maps to `generations` table
- **Generation Error Logs** - Maps to `generation_error_logs` table

## 2. Endpoints

### 2.1 Flashcards Endpoints

#### GET /api/flashcards

- **Description**: Get user's flashcards
- **Query Parameters**:
  - `page` (optional): Page number for pagination (default: 1)
  - `limit` (optional): Items per page (default: 20)
  - `sort_by` (optional): Field to sort by (default: created_at)
  - `sort_order` (optional): asc or desc (default: desc)
  - `cefr_level` (optional): Filter by CEFR level
  - `status` (optional): Filter by status (active/inactive)
  - `source` (optional): Filter by source
- **Response**:
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "front_content": "string",
        "back_content": "string",
        "front_language": "string",
        "back_language": "string",
        "cefr_level": "string",
        "source": "string",
        "source_youtube_url": "string",
        "status": "string",
        "created_at": "timestamp",
        "updated_at": "timestamp"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  }
  ```
- **Success Codes**: 200 OK
- **Error Codes**: 401 Unauthorized, 500 Internal Server Error

#### GET /api/flashcards/:id

- **Description**: Get a single flashcard by ID
- **Response**:
  ```json
  {
    "id": "uuid",
    "front_content": "string",
    "back_content": "string",
    "front_language": "string",
    "back_language": "string",
    "cefr_level": "string",
    "source": "string",
    "source_youtube_url": "string",
    "status": "string",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
  ```
- **Success Codes**: 200 OK
- **Error Codes**: 401 Unauthorized, 404 Not Found, 500 Internal Server Error

#### POST /api/flashcards

- **Description**: Create one or multiple flashcards (manual or AI-generated)
- **Request Body**:
  ```json
  {
    "flashcards": [
      {
        "front_content": "string (required, max 200 chars)",
        "back_content": "string (required, max 500 chars)",
        "front_language": "string (required)",
        "back_language": "string (required)",
        "cefr_level": "string (required, one of: A1, A2, B1, B2, C1, C2)",
        "source": "string (optional, default: manual, one of: manual, ai_youtube_full, ai_youtube_edited, ai_text_full, ai_text_edited)",
        "source_youtube_url": "string (conditional, required if source contains youtube)"
      }
    ],
    "generation_id": "uuid (optional, links flashcards to a specific generation)"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "created_count": "number",
    "flashcards": [
      {
        "id": "uuid",
        "front_content": "string",
        "back_content": "string",
        "front_language": "string",
        "back_language": "string",
        "cefr_level": "string",
        "source": "string",
        "source_youtube_url": "string",
        "status": "string",
        "created_at": "timestamp",
        "updated_at": "timestamp"
      }
    ]
  }
  ```
- **Success Codes**: 201 Created
- **Error Codes**: 400 Bad Request, 401 Unauthorized, 500 Internal Server Error

#### PATCH /api/flashcards/:id

- **Description**: Update a flashcard
- **Request Body**:
  ```json
  {
    "front_content": "string (optional, max 200 chars)",
    "back_content": "string (optional, max 500 chars)",
    "front_language": "string (optional)",
    "back_language": "string (optional)",
    "cefr_level": "string (optional, one of: A1, A2, B1, B2, C1, C2)",
    "status": "string (optional, one of: active, inactive)"
  }
  ```
- **Response**: Same as GET /api/flashcards/:id
- **Success Codes**: 200 OK
- **Error Codes**: 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Internal Server Error

#### DELETE /api/flashcards/:id

- **Description**: Delete a flashcard
- **Response**: No content
- **Success Codes**: 204 No Content
- **Error Codes**: 401 Unauthorized, 404 Not Found, 500 Internal Server Error

### 2.2 Generations Endpoints

#### POST /api/generations

- **Description**: Start a new generation process for flashcards proposals
- **Request Body**:
  ```json
  {
    "source_type": "string (required, one of: youtube, text)",
    "source_text": "string (required max 15000 chars)",
    "source_youtube_url": "string (conditional, required if source_type is youtube)",
    "front_language": "string (required)",
    "back_language": "string (required)"
  }
  ```
- **Response**:
  ```json
  {
    "id": "uuid",
    "status": "string (e.g., pending, completed, error)",
    "generated_flashcards": [
      {
        "id": "uuid (temporary)",
        "front_content": "string",
        "back_content": "string",
        "front_language": "string",
        "back_language": "string",
        "cefr_level": "string",
        "source": "string"
      }
    ],
    "created_at": "timestamp"
  }
  ```
- **Success Codes**: 201 Created (for immediate results) or 202 Accepted (for async processing)
- **Error Codes**: 400 Bad Request, 401 Unauthorized, 500 Internal Server Error (errors are logged in `generation_error_logs` table)

#### GET /api/generations

- **Description**: Get user's generation history
- **Query Parameters**:
  - `page` (optional): Page number for pagination (default: 1)
  - `limit` (optional): Items per page (default: 20)
- **Response**:
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "model": "string",
        "generation_duration": "number",
        "generated_count": "number",
        "accepted_unedited_count": "number",
        "accepted_edited_count": "number",
        "source_type": "string",
        "source_youtube_url": "string",
        "created_at": "timestamp"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  }
  ```
- **Success Codes**: 200 OK
- **Error Codes**: 401 Unauthorized, 500 Internal Server Error

#### GET /api/generations/:id

- **Description**: Get details of a specific generation
- **Response**:
  ```json
  {
    "id": "uuid",
    "model": "string",
    "generation_duration": "number",
    "generated_count": "number",
    "accepted_unedited_count": "number",
    "accepted_edited_count": "number",
    "source_type": "string",
    "source_youtube_url": "string",
    "source_text_length": "number",
    "created_at": "timestamp",
    "generated_flashcards": [
      {
        "id": "uuid (temporary)",
        "front_content": "string",
        "back_content": "string",
        "front_language": "string",
        "back_language": "string",
        "cefr_level": "string",
        "source": "string",
        "status": "string (temporary, one of: pending, accepted, edited, rejected)"
      }
    ]
  }
  ```
- **Success Codes**: 200 OK
- **Error Codes**: 401 Unauthorized, 404 Not Found, 500 Internal Server Error

### 2.3 Generation Error Logs Endpoints

#### GET /api/generation-error-logs

- **Description**: Get user's generation error logs
- **Query Parameters**:
  - `page` (optional): Page number for pagination (default: 1)
  - `limit` (optional): Items per page (default: 20)
  - `sort_by` (optional): Field to sort by (default: created_at)
  - `sort_order` (optional): asc or desc (default: desc)
  - `error_code` (optional): Filter by error code
  - `source_type` (optional): Filter by source type (youtube/text)
- **Response**:
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "model": "string",
        "source_type": "string",
        "source_youtube_url": "string",
        "source_text_length": "number",
        "error_code": "string",
        "error_message": "string",
        "created_at": "timestamp"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  }
  ```
- **Success Codes**: 200 OK
- **Error Codes**: 401 Unauthorized, 500 Internal Server Error

#### GET /api/generation-error-logs/:id

- **Description**: Get details of a specific generation error log
- **Response**:
  ```json
  {
    "id": "uuid",
    "model": "string",
    "source_type": "string",
    "source_youtube_url": "string",
    "source_text_hash": "string",
    "source_text_length": "number",
    "error_code": "string",
    "error_message": "string",
    "created_at": "timestamp"
  }
  ```
- **Success Codes**: 200 OK
- **Error Codes**: 401 Unauthorized, 404 Not Found, 500 Internal Server Error

## 3. Validation and Business Logic

### Validation Rules

1. **Flashcards**

   - `front_content`: Required, max 200 characters
   - `back_content`: Required, max 500 characters
   - `front_language`, `back_language`: Required
   - `cefr_level`: Required, must be one of: A1, A2, B1, B2, C1, C2
   - `source`: Required, must be one of: ai_youtube_full, ai_youtube_edited, ai_text_full, ai_text_edited, manual
   - `status`: Required, must be one of: active, inactive

2. **Generations**
   - `source_type`: Required, must be one of: youtube, text
   - `source_text`: Required, max 15000 characters
   - `source_youtube_url`: Required if source_type is youtube, must be valid YouTube URL
   - `front_language`, `back_language`: Required

### Business Logic Implementation

1. **YouTube Subtitle Extraction**

   - API validates YouTube URL format
   - Backend extracts subtitles with 15000 character limit
   - Character count validation before processing

2. **AI Generation Process**

   - Backend integrates with openrouter.ai for LLM access
   - Request format validates required parameters
   - Generation metrics tracked in database

3. **Flashcard Acceptance Flow**

   - Temporary IDs assigned to generated flashcards proposals
   - Saving single or multiple cards

4. **Flashcard Managment**

   - Automatic update of the `updated_at` field via database triggers when flashcards are modified

5. **Error Handling**
   - Generation errors logged in generation_error_logs table
   - User-friendly error messages returned via API
   - Detailed error logging for debugging
