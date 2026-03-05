export const KNOWLEDGE_BASE = [
  {
    id: "overview",
    topic: "Product Overview",
    content: `DocExtract is a document intelligence platform that extracts, parses, splits, and redacts structured data from unstructured documents (PDFs, scanned images, etc.). It supports multiple ingestion methods including REST API, Kafka, and Email. You can configure per-document extraction schemas, parsing engines, and redaction rules via the UI or programmatically.`
  },
  {
    id: "api_integration",
    topic: "API Integration",
    content: `DocExtract provides a REST API for document submission and result retrieval.

Base URL: https://api.docextract.io/v1

Authentication: Include your API key in the Authorization header:
  Authorization: Bearer <YOUR_API_KEY>

Submit a document:
  POST /documents
  Content-Type: multipart/form-data
  Body: { file: <binary>, profile_id: "your-profile-id", async: true }

Get extraction result:
  GET /documents/{document_id}/result

List documents:
  GET /documents?status=completed&limit=50

Supported formats: PDF, PNG, JPG, JPEG, TIFF.

Webhooks: Configure a webhook URL in your profile settings to receive real-time notifications when processing completes. The payload includes document_id, status, and result_url.`
  },
  {
    id: "kafka_integration",
    topic: "Kafka Integration",
    content: `DocExtract supports Apache Kafka for high-throughput document ingestion and result streaming.

Ingestion Topic: docextract.documents.inbound
  Produce a JSON message with:
  {
    "profile_id": "your-profile-id",
    "document_url": "https://your-storage/doc.pdf",
    "metadata": { "source": "invoice-pipeline", "tenant_id": "acme" }
  }

Results Topic: docextract.documents.results
  Consume extraction results in real-time:
  {
    "document_id": "doc_abc123",
    "status": "completed",
    "profile_id": "your-profile-id",
    "extracted_fields": { ... },
    "timestamp": "2024-01-15T10:30:00Z"
  }

Connection config (add to your producer/consumer):
  bootstrap.servers=kafka.docextract.io:9092
  security.protocol=SASL_SSL
  sasl.mechanism=PLAIN
  sasl.username=<YOUR_API_KEY>
  sasl.password=<YOUR_API_SECRET>

Dead Letter Queue: Failed messages are routed to docextract.documents.dlq with an error field explaining the failure.`
  },
  {
    id: "email_integration",
    topic: "Email Ingestion",
    content: `DocExtract can receive documents via email. Each profile gets a unique inbound email address.

1. Go to Onboarding → select your profile → Ingestion Source tab.
2. Enable "Email Ingestion" and copy your unique inbound address (e.g. acme-invoices@ingest.docextract.io).
3. Forward or CC that address on emails containing document attachments.
4. DocExtract will automatically extract attachments and process them against your profile configuration.

Supported attachment types: PDF, PNG, JPG, TIFF.
Max attachment size: 50 MB per email.
Email subject and body are stored as metadata on the document record.`
  },
  {
    id: "s3_integration",
    topic: "S3 / Cloud Storage Integration",
    content: `DocExtract can automatically ingest documents from S3 buckets or GCS/Azure Blob Storage.

S3 Setup:
1. In your profile's Ingestion Source, select "S3 / Cloud Storage".
2. Provide your bucket name, AWS region, and a folder prefix (optional).
3. Create an IAM role with s3:GetObject and s3:ListBucket permissions and share the ARN with DocExtract.
4. DocExtract will poll the bucket every 60 seconds (configurable) or you can trigger via S3 Event Notifications to an SQS queue that DocExtract monitors.

Processed files are moved to a /processed subfolder automatically to avoid re-ingestion.`
  },
  {
    id: "profiles",
    topic: "Profiles & Onboarding",
    content: `A Profile defines a document type and its processing configuration. You create profiles in the Onboarding section.

Steps to create a profile:
1. Click "New Profile" in Onboarding.
2. Step 1 – Profile Info: Set App ID, Name, Contact Email, and Approvers.
3. Step 2 – Document Config: Select which document types to process.
4. Step 3 – Document Prefs: Choose extraction model and special instructions.
5. Step 4 – Review & Submit.

Each profile can have multiple approvers who receive notifications. Profiles map inbound documents to specific extraction schemas and configurations.`
  },
  {
    id: "extraction",
    topic: "Extraction Configuration",
    content: `Extraction defines which fields to pull from a document.

In Document Config → select a document → Extraction tab:
- Task Description: Describe what the document is about to guide the AI.
- Fields: Add fields with a name, type (text, nested, tabular), and description.
- Nested fields support complex structures like tables-within-tables.

Extraction engines: GPT-4o (high accuracy), Claude 3 (balanced), Fast Extract (low latency).
Mode options: Strict (only extract defined fields), Flexible (also infer unlisted fields).
Temperature: Lower = more deterministic; Higher = more flexible for ambiguous docs.`
  },
  {
    id: "parsing",
    topic: "Parse / OCR",
    content: `Parse converts raw document bytes into structured text blocks.

Engines available:
- Docling: Best for complex layouts, tables, and multi-column documents.
- Fast Parse: Optimized for speed on simple single-column text PDFs.

Output formats: Markdown or JSON (array of text blocks with type, content, confidence).

Confidence scores indicate how certain the engine is about each extracted block. Enable via the Confidence toggle in the Parse panel.

To re-parse with different settings, click Re-parse in the Parse panel.`
  },
  {
    id: "splitting",
    topic: "Document Splitting",
    content: `Splitting separates a single multi-document PDF into individual document types.

How it works:
1. Enable Split in your document's capabilities.
2. Define categories (e.g., "Cover Letter", "K-1 Tax Form", "Financial Statement").
3. Submit a PDF — DocExtract classifies each page into a category and returns split document objects.

You can also write a Rule Prompt in natural language to describe how to split, upload JSON rules, or use AI Suggestions which auto-detects document boundaries.

Split results are accessible via GET /documents/{id}/splits in the API.`
  },
  {
    id: "redaction",
    topic: "Redaction",
    content: `Redaction removes or masks sensitive information before storing or returning a document.

Supported patterns:
- Social Security Numbers (SSN)
- Credit Card Numbers
- Phone Numbers
- Email Addresses
- Dates of Birth
- Custom Regex patterns

Configure redaction in Document Config → Redaction tab. You can choose to black-box redact (replace with ████) or tokenize (replace with a reversible token for internal use).

Redacted PDFs are returned alongside extracted data in the API response.`
  },
  {
    id: "transactions",
    topic: "Transactions & Monitoring",
    content: `Every document processed generates a Transaction record visible in the Transactions page.

Statuses:
- Completed: Successfully processed.
- Processing: Currently running.
- Failed: Encountered an error (see the Steps panel for details).
- Pending Approval: Awaiting an approver's sign-off.

You can re-run failed transactions or reject completed ones from the Transactions page. Each transaction shows the step-by-step processing log so you can pinpoint failures.

Filter transactions by status, use case, or free-text search on the document name.`
  },
  {
    id: "auth_api_keys",
    topic: "Authentication & API Keys",
    content: `DocExtract uses API key authentication for all API and Kafka access.

To generate an API key:
1. Go to Settings (bottom of the sidebar).
2. Click "API Keys" → "Generate New Key".
3. Give it a name and set an expiry (optional).
4. Copy and store the key securely — it won't be shown again.

Keys can be scoped to read-only or read-write. Rotate keys at any time without downtime by generating a new key before deleting the old one.

For Kafka, use the API Key as sasl.username and the API Secret as sasl.password.`
  },
  {
    id: "webhooks",
    topic: "Webhooks",
    content: `Webhooks deliver real-time processing notifications to your server.

Setup:
1. In your profile settings, add a Webhook URL.
2. Choose which events to subscribe to: document.completed, document.failed, document.split_completed.
3. DocExtract will POST a JSON payload to your URL within seconds of the event.

Payload example:
{
  "event": "document.completed",
  "document_id": "doc_abc123",
  "profile_id": "profile_xyz",
  "status": "completed",
  "result_url": "https://api.docextract.io/v1/documents/doc_abc123/result",
  "timestamp": "2024-01-15T10:30:00Z"
}

Retries: DocExtract retries failed webhook deliveries up to 5 times with exponential backoff. Check delivery logs in Settings → Webhooks.`
  },
  {
    id: "playground",
    topic: "Playground",
    content: `The Playground is a sandbox for testing document processing without affecting production data.

Tools available:
- Parse: Upload a PDF and see raw text extraction with confidence scores. Switch between Markdown and JSON views.
- Split: Test document splitting with AI suggestions or custom rules.
- Extract: Run field extraction against a document.
- Chat: Ask questions about the content of an uploaded document.

The Playground does not count against your processing quota. Use it to tune extraction schemas and test edge cases before deploying to production.`
  }
];