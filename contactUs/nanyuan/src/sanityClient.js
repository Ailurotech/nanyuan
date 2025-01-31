import sanityClient from '@sanity/client'
import { createClient } from '@sanity/client';

export const client = createClient({
    projectId: 'vdd7g2vw', 
    dataset: 'production',  
    apiVersion: '2023-01-01',      
    token: 'skzaklRFdavRt8L3ijT5l0QejoxqJi7lYf41bilIJrmrVXjvHBlCGtsJAhuekGgS6rd20ost0lT68rq2KO8fbS8Ls55FH6xPWzkx3wi1l4cpbYSD539j9o7VEhDZd6P7Kkwr2lyK58nkjAnfc1HdwqaGb6kThoDqfyvMg3z1h6mNRAB8icpl',
    useCdn: true, 
});
