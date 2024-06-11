document.getElementById('joke-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const jokeInput = document.getElementById('joke-input');
    const joke = jokeInput.value.trim();

    if (joke) {
        await fetch('/jokes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: joke })
        });
        jokeInput.value = '';
        loadJokes();
    }
});

async function loadJokes() {
    const response = await fetch('/jokes');
    const jokes = await response.json();
    const jokesList = document.getElementById('jokes-list');
    jokesList.innerHTML = '';
    jokes.forEach(joke => {
        const jokeItem = document.createElement('div');
        jokeItem.className = 'joke-item';
        jokeItem.innerHTML = `
            ${joke.text} 
            <button class="laugh-button" onclick="laugh('${joke._id}')">
                Laugh (${joke.laughs})
            </button>
        `;
        jokesList.appendChild(jokeItem);
    });
}

async function laugh(jokeId) {
    await fetch(`/jokes/${jokeId}/laugh`, {
        method: 'POST'
    });
    loadJokes();
}

loadJokes();
