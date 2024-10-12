import axios from 'axios';

const category: string = 'happiness'; // Define the category

// Function to fetch a quote
export const fetchQuote = async (): Promise<void> => {
    const apiUrl: string = `https://api.api-ninjas.com/v1/quotes?category=${category}`;

    try {
        const response = await axios.get(apiUrl, {
            headers: {
                'X-Api-Key': 'WObJpDyID75V+qscVkHA+g==bDWyBPUIn1Zo0W7U', // Replace with your actual API key
            },
            // contentType is not needed in axios; it automatically sets it based on the data being sent
        });

        if (response.status === 200 && response.data.length > 0) {
            return response.data[0].quote;
        } else {} // Log the result on success
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // Handle Axios error
            console.error('Error:', error.response?.data || error.message);
        } else {
            // Handle other errors
            console.error('Error:', error);
        }
    }
};

// Call the function to fetch the quote
fetchQuote();
