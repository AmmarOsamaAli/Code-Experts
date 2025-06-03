const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const data = JSON.parse(event.body);
        const { Name, Email, Phone, Subject, Message, "Submission Date": SubmissionDate } = data.fields;

        // Validate required fields
        if (!Name || !Email || !Message) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing required fields' })
            };
        }

        // Prepare Airtable API request
        const airtableResponse = await fetch(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Contacts`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.AIRTABLE_PAT}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                records: [
                    {
                        fields: {
                            Name,
                            Email,
                            "Phone Number": Phone || '',
                            Subject: Subject || '',
                            Message,
                            "Submission Date": SubmissionDate || new Date().toISOString()
                        }
                    }
                ]
            })
        });

        if (!airtableResponse.ok) {
            const error = await airtableResponse.json();
            throw new Error(error?.error?.message || 'Airtable API error');
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Form submitted successfully' })
        };
    } catch (error) {
        console.error('Submission Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
