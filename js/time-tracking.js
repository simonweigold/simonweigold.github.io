async function fetchData() {
    try {
        const response = await fetch('https://clockify-worker.simonw750.workers.dev/time-difference', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }

        const data = await response.json();
        //document.getElementById('socioTotalTime').textContent = data.sociology.totalTime.toFixed(2);
        //document.getElementById('socioDifference').textContent = data.sociology.difference.toFixed(2);
        document.getElementById('socioFormatted').textContent = data.sociology.formatted;

        //document.getElementById('coldTotalTime').textContent = data.cold.totalTime.toFixed(2);
        //document.getElementById('coldDifference').textContent = data.cold.difference.toFixed(2);
        document.getElementById('coldFormatted').textContent = data.cold.formatted;
    } catch (error) {
        console.error('Error:', error);
        //document.getElementById('socioTotalTime').textContent = 'Error';
        //document.getElementById('socioDifference').textContent = 'Error';
        document.getElementById('socioFormatted').textContent = 'Error';

        //document.getElementById('coldTotalTime').textContent = 'Error';
        //document.getElementById('coldDifference').textContent = 'Error';
        document.getElementById('coldFormatted').textContent = 'Error';
    }
}

window.onload = fetchData;