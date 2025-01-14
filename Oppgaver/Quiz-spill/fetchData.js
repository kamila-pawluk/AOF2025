//fetchData.js

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }



async function GetData() {
    let endpoint = 'https://opentdb.com/api.php?amount=10&category=9&difficulty=hard&type=multiple';
    try {
        const request = await fetch(endpoint);
        if (!request.ok) {
        throw new Error(`HTTP error! status: ${request.status}`);
        }

        const dataType = request.headers.get('content-type');

    if (dataType.includes('application/json')) {
        const response = await request.json();
        console.log(response);
        localStorage.setItem('quizData', JSON.stringify(response));
        console.log('Data fetched and stored in local storage');
        return response;
    } else {
        console.log('We expected the data to be in JSON format, but it was not');
        return {results: [] };
    }
} catch (error) {
    console.error('An error occurred while fetching the data:', error);
    alert('An error occurred while fetching the data. Please try again later.');
    return {results: [] };
} finally {
    await delay(5000);
}
}
