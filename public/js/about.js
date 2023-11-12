async function loadAboutPage() {
    const randomQuoteElem = document.getElementById("random-quote")
    try {
        const { content, author } = await fetch(`https://api.quotable.io/random`, {
            method: "GET"
        }).then(r => r.json())

        randomQuoteElem.innerText = `"${content}"\n-${author}`

    } catch(error) {
        console.error(error)
    }
}