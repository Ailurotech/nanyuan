const client = require('@sanity/client');
/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const client = createClient({
    projectId: 'vdd7g2vw', 
    dataset: 'production',  
    apiVersion: '2023-01-01',      
    token: 'skzaklRFdavRt8L3ijT5l0QejoxqJi7lYf41bilIJrmrVXjvHBlCGtsJAhuekGgS6rd20ost0lT68rq2KO8fbS8Ls55FH6xPWzkx3wi1l4cpbYSD539j9o7VEhDZd6P7Kkwr2lyK58nkjAnfc1HdwqaGb6kThoDqfyvMg3z1h6mNRAB8icpl',
    useCdn: flase, 
});

exports.handler = async (event) => {
    const origin = event.headers.origin || event.headers.Origin;
    const allowedOrigins = [process.env.ALLOWED_ORIGIN || 'http://localhost:3000'];

    if (!allowedOrigins.includes(origin)) {
        return {
            statusCode: 403,
            body: JSON.stringify({ message: 'Forbidden' }),
        };
    }

    const headers = {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, GET",
        "Content-Type": "application/json"
    };
    try {
        switch (event.httpMethod) {
            case 'GET':
                const restaurantInfoQuery = '*[_type == "restaurantInfo"][0]';
                const restaurantInfo = await client.fetch(restaurantInfoQuery);
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify(restaurantInfo || null),
                };
            case 'POST':
                const body = JSON.parse(event.body);
                const { name = '', message = '', phone = '' } = body;

                if (!name || !message) {
                    return {
                        statusCode: 400,
                        headers,
                        body: JSON.stringify({ message: 'name and message are required' }),
                    };
                }

                const contactMessageDoc = {
                    _type: 'contactMessage',
                    name,
                    message,
                    phone,
                    createdAt: new Date().toISOString(),
                };

                const result = await client.create(contactMessageDoc);

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ message: 'Send successfully', result }),
                };
            default:
                return {
                    statusCode: 405,
                    headers,
                    body: JSON.stringify({ message: 'Method Not Allowed' }),
                };
        }
    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*", 
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
        };
    }
};
