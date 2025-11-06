# **Technical Specification: RingkasCepat**

Project: RingkasCepat — Peringkas Konten Instan (Berbasis AI)  
Version: 1.0  
Date: 2025-11-06

## **1\. Overview**

### **1.1. Project Summary**

RingkasCepat is a modern, AI-powered web application designed to combat information overload. It provides users with instant, high-quality summaries of long-form content, including articles, social media threads, text blocks, and YouTube videos. By leveraging the Gemini 2.5 Flash model, the app delivers core ideas and key takeaways in seconds, presented in a clean, readable, and stylish UI.

### **1.2. Core Problem & Solution**

* **Problem:** Users face information overload ("infobesity") and a "Fear of Missing Out" (FOMO). They lack the time to read or watch lengthy content but still need to grasp the essential information.  
* **Solution:** A single-page application (SPA) where users can paste a URL or text. The app's backend fetches and processes the content, sends it to the Gemini API for summarization, and displays a concise, easy-to-digest summary.

### **1.3. Tech Stack**

* **Framework:** Next.js 15 (App Router, Turbopack)  
* **Language:** TypeScript  
* **Authentication:** Better Auth  
* **Database:** PostgreSQL  
* **ORM:** Drizzle ORM  
* **Styling:** Tailwind CSS v4  
* **UI Components:** shadcn/ui (New York style)  
* **Theming:** next-themes  
* **Icons:** Lucide React

## **2\. System Architecture**

The application follows a modern server-centric architecture, leveraging Next.js Server Components and Server Actions for most of the logic.

### **2.1. Component Breakdown**

1. **Client (Next.js 15 / React):**  
   * Renders the UI using shadcn/ui components.  
   * Handles user input (text/URL pasting, option selection).  
   * Manages client-side state (e.g., loading, error, result).  
   * Invokes Server Actions for summarization and data fetching.  
2. **Next.js Server (App Router):**  
   * **Server Actions:** Securely handles all business logic.  
     * summarizeContent(formData): The primary action.  
     * fetchHistory(): Gets the user's past summaries.  
     * deleteSummary(summaryId): Deletes a history item.  
   * **Authentication:** middleware.ts (via Better Auth) protects the main application routes, redirecting unauthenticated users.  
   * **API (External):** The server is the *only* component that communicates with the Google Gemini API. The API key is stored securely in server-side environment variables.  
3. **Database (PostgreSQL \+ Drizzle):**  
   * Stores user profile information (managed by Better Auth).  
   * Persists all summary requests and results, linked to a user ID.  
4. **External Services:**  
   * **Google Gemini API:** The gemini-2.5-flash-preview-09-2025 model is used for all summarization tasks.  
   * **Content Fetching:** The server will use fetch to get raw HTML from URLs.  
   * **Content Parsing:**  
     * **Articles:** A library like cheerio will be used server-side to parse fetched HTML and extract the main article text, stripping ads and navigation.  
     * **YouTube:** A library like youtube-transcript will be used server-side to fetch the video's transcript.

## **3\. User Flow**

### **3.1. Authentication Flow**

1. A new user lands on the homepage (/).  
2. The page is protected by middleware.ts.  
3. The user is redirected to the Better Auth login/signup page.  
4. User authenticates (e.g., via Google, Email).  
5. On success, Better Auth redirects the user to the main dashboard (/app).

### **3.2. Summarization Flow (URL)**

1. User is on the /app page.  
2. The default UI shows Tabs for "URL", "Text", and "YouTube". "URL" is active.  
3. User pastes an article URL into the Input field.  
4. User selects a summarization style (e.g., "Key Bullet Points") from a Select component.  
5. User clicks the "Ringkas" (Button).  
6. The client UI enters a loading state (e.g., Skeleton components appear in the result pane, and the button shows a Loader icon).  
7. A Server Action (summarizeContent) is invoked.  
8. On the Server:  
   a. The action validates the URL.  
   b. It fetches the URL.  
   c. It uses cheerio to parse the HTML and extract the main body text.  
   d. It constructs a prompt (e.g., "Summarize the following article into 3 key bullet points: \[Extracted Text\]").  
   e. It calls the Gemini API with this prompt.  
   f. On receiving a response, it saves the (userId, sourceUrl, summaryText, type) to the PostgreSQL database via Drizzle.  
   g. It returns the summaryText (or an error) to the client.  
9. On the Client:  
   a. The loading state ends.  
   b. The Card in the result pane is populated with the returned summaryText.  
   c. The "Copy" and "Share" buttons become active.

### **3.3. Post-Summary Flow**

1. **Copy:** User clicks the "Copy" (Copy icon) button. The summary text is copied to the clipboard. A Toast notification appears ("Summary copied\!").  
2. **Share:** User clicks the "Share" (Share2 icon) button. The native Web Share API is invoked, allowing the user to share the summary text.  
3. **History:** The user's new summary instantly appears at the top of their "History" list (which could be in a sidebar Sheet).

## **4\. Database Schema (Drizzle ORM)**

File: src/db/schema.ts

import {  
  pgTable,  
  text,  
  timestamp,  
  varchar,  
  serial,  
  primaryKey,  
  integer,  
  pgEnum,  
} from 'drizzle-orm/pg-core';  
import { relations } from 'drizzle-orm';

// \--- User Table (Managed by Better Auth) \---  
// This schema assumes Better Auth's default user model.  
// We define it here to establish foreign key relations.

export const users \= pgTable('user', {  
  id: text('id').notNull().primaryKey(),  
  email: text('email').notNull().unique(),  
  name: text('name'),  
  // Other fields as required by Better Auth...  
  createdAt: timestamp('created\_at').defaultNow().notNull(),  
});

// \--- Summaries Table \---

export const summarySourceEnum \= pgEnum('summary\_source\_type', \[  
  'text',  
  'url',  
  'youtube',  
\]);

export const summaryStyleEnum \= pgEnum('summary\_style\_type', \[  
  'bullet\_points',  
  'short\_paragraph',  
  'explain\_like\_five',  
\]);

export const summaries \= pgTable('summary', {  
  id: serial('id').primaryKey(),  
  userId: text('user\_id')  
    .notNull()  
    .references(() \=\> users.id, { onDelete: 'cascade' }),  
    
  sourceType: summarySourceEnum('source\_type').notNull(),  
  summaryStyle: summaryStyleEnum('summary\_style').notNull(),

  originalSource: text('original\_source'), // The URL or a snippet of the original text  
    
  // The full text that was sent to the API (after parsing)  
  // May be large, but good for historical reference.  
  processedText: text('processed\_text'),   
    
  // The final summary result from Gemini  
  summaryText: text('summary\_text').notNull(),

  createdAt: timestamp('created\_at').defaultNow().notNull(),  
});

// \--- Relations \---

export const usersRelations \= relations(users, ({ many }) \=\> ({  
  summaries: many(summaries),  
}));

export const summariesRelations \= relations(summaries, ({ one }) \=\> ({  
  user: one(users, {  
    fields: \[summaries.userId\],  
    references: \[users.id\],  
  }),  
}));

## **5\. API Integration (Gemini)**

* **File:** src/app/actions/summarize.ts (or similar Server Action file)  
* **SDK:** @google/generative-ai  
* **Model:** gemini-2.5-flash-preview-09-2025  
* **Authentication:** The GOOGLE\_API\_KEY will be stored in .env.local and accessed *only* on the server.

### **5.1. Prompt Engineering Strategy**

A systemInstruction will be used to set the context for the AI.

System Prompt:  
"You are 'RingkasCepat', a highly advanced AI summarization assistant. Your goal is to provide summaries that are clear, concise, accurate, and easy to understand. Follow the user's instructions for the summary format precisely. All responses should be in the same language as the input text."  
**Dynamic User Prompts:**

* **Key Bullet Points:** "Based on the following text, provide the 3-5 most important key bullet points:\\n\\n\[CONTENT\]"  
* **100-Word Summary:** "Summarize the following text into a single, well-written paragraph of approximately 100 words:\\n\\n\[CONTENT\]"  
* **ELI5 (Explain Like I'm 5):** "Explain the main idea of the following text as if you were talking to a 5-year-old child:\\n\\n\[CONTENT\]"

### **5.2. Error Handling**

The server action will implement robust try...catch blocks to handle:

* **Fetch Errors:** Invalid URLs, 404s, 500s from the source.  
* **Parsing Errors:** Inability to find content (e.g., paywalls, SPA content).  
* **Gemini API Errors:** Rate limits, content safety blocks, quota issues.  
* **Database Errors:** Failure to write the summary to the DB.

These errors will be returned to the client in a structured format (e.g., { success: false, error: 'Message' }) and displayed in an Alert component.

## **6\. Key UI Components (shadcn/ui)**

| Component | Location | Purpose |
| :---- | :---- | :---- |
| **Button** | Main UI, History | "Ringkas", "Copy", "Share", "Delete", "Toggle Theme" |
| **Tabs** | Main UI | To switch between "Text", "URL", and "YouTube" input modes. |
| **Card** | Main UI | Used to frame the input section and the result section. |
| **Input** | Input Card | For pasting URLs. |
| **Textarea** | Input Card | For pasting raw text. |
| **Select** | Input Card | For choosing the summarization style. |
| **Sheet** | App Layout | Sidebar to display the user's summaries history. |
| **Skeleton** | Result Card | Loading placeholder while the API call is in progress. |
| **Toast** | App Layout | To show notifications (e.g., "Summary copied\!"). |
| **Alert** | Result Card | To display any errors (e.g., "Failed to fetch URL."). |
| **Tooltip** | Result Card | To provide hints for the "Copy" and "Share" icon buttons. |
| **DropdownMenu** | Header | For the next-themes (Light/Dark) toggle and user profile/logout. |
