export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { endpoint, method, headers, body } = req.body;
    
    if (!endpoint) return res.status(400).json({ error: 'Missing endpoint' });

    const fetchOptions = {
      method: method || 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(headers || {})
      }
    };
    
    if (body) {
      fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(endpoint, fetchOptions);
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = { text };
    }

    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
