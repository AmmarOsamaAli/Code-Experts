const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const data = JSON.parse(event.body);
        
        // Validate required fields
        if (!data.fields.Name || !data.fields.Email || !data.fields.Message) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing required fields' })
            };
        }

        // Send to Airtable using Personal Access Token
        const response = await fetch(
            `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Contacts`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.AIRTABLE_PAT}`,
                    'User-Agent': 'Spoon Contact Form'
                },
                body: JSON.stringify(data)
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Airtable Error:', errorData);
            throw new Error(errorData.error?.message || 'Airtable API error');
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Form submitted successfully' })
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message || 'Internal server error' })
        };
    }
};