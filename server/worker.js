// Cloudflare Worker script for token verification and user info

export const GEN_SCRIPT_PROMPT = `You are a JavaScript expert good at writing user scripts.

# Task
You will generate a userscript according to user requirement.
This script will be injected to web page by a browser extension like Tampermonkey, but not all userscript features are supported.

The script MUST follow these rules:
1. Start with a metadata block using // ==UserScript== format
2. Use @match directive to control where the script runs, should apply to current domain only if not specified
3. Optionally include @run-at directive (document_start, document_end, or document_idle)
4. Do not use unsupported directives, which is listed below:
    - @include
    - @exclude
    - @grant
    - @require
5. Use vanilla JavaScript that works in modern browsers
6. Use proper error handling for DOM operations
7. Add descriptive comments for complex logic
8. The user script should be relative short (less than 100 lines of code) and simple.

# Code Guidelines
1. always use console.log to indicate start and end of the script
2. use localStorage for data storage if needed
3. use fetch to make network requests if needed


# Examples

## Example 1
<context>
url: https://example.com/blog
title: Welcome to Example Blog
selectionHtml: "<div class='article-content'>This is a sample article with dark text.</div>"
</context>

<requirement>
Add dark mode to this blog
</requirement>

<output>
\`\`\`javascript
// ==UserScript==
// @name        Dark Mode for Example Blog
// @match       https://example.com/blog/*
// @run-at      document_end
// ==UserScript==

// Create dark mode styles specific to blog content
console.log('[Dark Mode] Creating dark mode styles');
const style = document.createElement('style');
style.textContent = \`
  body {
    background-color: #1a1a1a !important;
    color: #e0e0e0 !important;
  }
  .article-content {
    background: #242424 !important;
    color: #e0e0e0 !important;
  }
  a { color: #66b3ff !important; }
\`;

// Add styles to page
try {
  document.head.appendChild(style);
} catch (error) {
  console.error('[Dark Mode] Failed to apply styles:', error);
}
console.log('[Dark Mode] Styles applied');
\`\`\`
</output>


## Example 2
<context>
url: https://video.example.com/watch?v=123
title: Example Video Player
selectionHtml: "<video id='main-player' class='video-js'>...</video>"
</context>

<requirement>
Add keyboard shortcuts of "j" (previous), "l" (next), "k" (play/pause) for video player
</requirement>

<output>
\`\`\`javascript
// ==UserScript==
// @name        Video Shortcuts for Example
// @match       https://video.example.com/*
// @run-at      document_idle
// ==UserScript==

console.log('[Video Shortcuts] Adding keyboard shortcuts');
// Add keyboard shortcuts for video player
document.addEventListener('keydown', (event) => {
  // Only handle if not typing in an input
  if (event.target.matches('input, textarea')) return;

  try {
    const video = document.querySelector('#main-player');
    if (!video) return;

    switch(event.key.toLowerCase()) {
      case 'j':
        video.currentTime -= 10;
        break;
      case 'l':
        video.currentTime += 10;
        break;
      case 'k':
        video.paused ? video.play() : video.pause();
        break;
    }
  } catch (error) {
    console.error('[Video Shortcuts] Error:', error);
  }
});
console.log('[Video Shortcuts] Keyboard shortcuts added');
\`\`\`
</output>

## Example 3
<context>
url: https://news.example.com/article/123
title: Premium Article - Subscribe Now
selectionHtml: "<div class='paywall'>Subscribe now to read more</div>"
</context>

<requirement>
Display contents behind a paywall
</requirement>

<output>
Sorry, this is not achievable by userscript.
</output>

# Output
If the requirement is reasonable and suitable for userscript, output the full code (wrapped by "\`\`\`javascript" and "\`\`\`") without any explanation.
Otherwise, explain why and suggest alternative solutions.

<context>
{context}
</context>

<requirement>
{requirement}
</requirement>
`;

/**
 * Call OpenAI chat completion API
 * @param {string} userRequest - User's script request
 * @param {any} context - Context of the page
 * @param {Env} env - Environment variables
 * @returns {Promise<string>} Generated script content
 */
async function generateScript(userRequest, context, env) {
  const prompt = GEN_SCRIPT_PROMPT.replace('{requirement}', userRequest)
    .replace('{context}', JSON.stringify(context));

  const response = await fetch(`${env.OPENAI_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1024,
      temperature: 0.3
    })
  });

  if (!response.ok) {
    throw new Error('OpenAI API call failed');
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * Verify Google OAuth token and return user info
 * @param {string} token - Google OAuth token
 * @returns {Promise<{email: string} | null>} User info or null if token is invalid
 */
async function verifyGoogleToken(token) {
  try {
    const response = await fetch(
      'https://www.googleapis.com/oauth2/v3/tokeninfo',
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return {
      email: data.email
    };
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Extract bearer token from Authorization header
 * @param {Request} request - Incoming request
 * @returns {string | null} Bearer token or null if not found
 */
function getBearerToken(request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice(7);
}

/**
 * Handle CORS preflight requests
 * @param {Request} request - Incoming request
 * @returns {Response} CORS preflight response
 */
function handleOptions(request) {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      'Access-Control-Max-Age': '86400',
    }
  });
}

/**
 * Create JSON response with CORS headers
 * @param {any} data - Response data
 * @param {number} status - HTTP status code
 * @returns {Response} Response object
 */
function jsonResponse(data, status = 200) {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
  );
}

/**
 * Get remaining quota for user
 * @param {D1Database} db - D1 database instance
 * @param {string} email - User email
 * @returns {Promise<number>} Remaining quota (0-20)
 */
async function getRemainingQuota(db, email) {
  const firstDayOfMonth = new Date();
  firstDayOfMonth.setDate(1);
  firstDayOfMonth.setHours(0, 0, 0, 0);

  const result = await db.prepare(
    `SELECT COUNT(*) as count
     FROM script_generations
     WHERE user_email = ?
     AND created_at >= datetime(?, 'unixepoch')`
  )
  .bind(email, firstDayOfMonth.getTime() / 1000)
  .first();

  console.log("remaining quota, email=", email, "count=", result.count);
  return Math.max(0, 20 - result.count);
}

/**
 * Main request handler
 * @param {Request} request - Incoming request
 * @param {Env} env - Environment variables
 * @returns {Promise<Response>} Response object
 */
async function handleRequest(request, env) {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return handleOptions(request);
  }

  const url = new URL(request.url);
  const path = url.pathname;

  // Handle GET /quota request
  if (request.method === 'GET' && path === '/quota') {
    // Verify token first
    const token = getBearerToken(request);
    if (!token) {
      return jsonResponse({ error: 'No token provided' }, 401);
    }

    const userInfo = await verifyGoogleToken(token);
    if (!userInfo) {
      return jsonResponse({ error: 'Invalid token' }, 401);
    }

    try {
      const remainingQuota = await getRemainingQuota(env.DB, userInfo.email);
      return jsonResponse({ remainingQuota });
    } catch (error) {
      console.error('Failed to get quota:', error);
      return jsonResponse({ error: 'Failed to get quota' }, 500);
    }
  }

  // Handle POST /script request
  if (request.method === 'POST' && path === '/script') {
    // Verify token first
    const token = getBearerToken(request);
    if (!token) {
      return jsonResponse({ error: 'No token provided' }, 401);
    }

    const userInfo = await verifyGoogleToken(token);
    if (!userInfo) {
      return jsonResponse({ error: 'Invalid token' }, 401);
    }

    try {
      const body = await request.json();
      const { user_request, context } = body;

      if (!user_request) {
        return jsonResponse({ error: 'Missing user_request in body' }, 400);
      }

      if (user_request.length > 1024) {
        return jsonResponse({ error: 'User request is too long' }, 400);
      }

      if (JSON.stringify(context).length > 8192) {
        return jsonResponse({ error: 'Context is too long' }, 400);
      }

      // Check remaining quota
      const remainingQuota = await getRemainingQuota(env.DB, userInfo.email);
      if (remainingQuota <= 0) {
        return jsonResponse({
          error:  'Monthly quota exceeded. Please try again next month, or set up your own LLM API in Settings.',
        }, 429);
      }

      const script = await generateScript(user_request, context, env);

      // Record generation in database
      await env.DB.prepare(
        'INSERT INTO script_generations (user_email, user_request, script) VALUES (?, ?, ?)'
      )
      .bind(userInfo.email, JSON.stringify({ user_request, context }), script)
      .run();

      return jsonResponse({
        script,
        remainingQuota: remainingQuota - 1
      });
    } catch (error) {
      console.error('Script generation failed:', error);
      return jsonResponse({ error: 'Failed to generate script' }, 500);
    }
  }

  return jsonResponse({ error: 'Not Found' }, 404);
}

// Export the request handler for Cloudflare Workers
export default {
  fetch: handleRequest
};
