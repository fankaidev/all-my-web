// Cloudflare Worker script for token verification and user info

/**
 * Call OpenAI chat completion API
 * @param {string} userRequest - User's script request
 * @param {Env} env - Environment variables
 * @returns {Promise<string>} Generated script content
 */
async function generateScript(userRequest, env) {
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
          role: 'system',
          content: 'You are a JavaScript expert. Generate clean, efficient and well-commented userscript code.'
        },
        {
          role: 'user',
          content: `Generate a userscript for: ${userRequest}`
        }
      ],
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
 * Check if user has exceeded monthly quota
 * @param {D1Database} db - D1 database instance
 * @param {string} email - User email
 * @returns {Promise<boolean>} True if quota exceeded
 */
async function checkQuotaExceeded(db, email) {
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

  console.log("check quota, email=", email, "count=", result.count);
  return result.count >= 20;
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
      const { user_request } = body;

      if (!user_request) {
        return jsonResponse({ error: 'Missing user_request in body' }, 400);
      }

      // Check monthly quota
      const quotaExceeded = await checkQuotaExceeded(env.DB, userInfo.email);
      if (quotaExceeded) {
        return jsonResponse({
          error: 'Monthly quota exceeded. Please try again next month.'
        }, 429);
      }

      const script = await generateScript(user_request, env);

      // Record generation in database
      await env.DB.prepare(
        'INSERT INTO script_generations (user_email, user_request, script) VALUES (?, ?, ?)'
      )
      .bind(userInfo.email, user_request, script)
      .run();

      return jsonResponse({ script });
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
