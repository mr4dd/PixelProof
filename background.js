const images = document.querySelectorAll("img");
let userToken, APIToken;

browser.storage.local.get().then(tokens => {
    APIToken = tokens.APIToken;
    userToken = tokens.userToken;
})

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function processImages() {
    for (const img of images) {
        const isAIGenerated = await check(img);
        if (isAIGenerated) {
            replace(img);
        } else {
            console.log(`${img.src} is not AI generated`);
        }
    }
    await sleep(200);
}

function replace(img) {
    img.src = "https://pbs.twimg.com/media/Fj-H_NWXgAAmcIW?format=jpg&name=large";
}

async function check(img) {
    try {
        // can run locally or host on cloud change url accordingly
        const response = await fetch("http://localhost:5000/process_images",
            {
                "method":"POST",
                "headers":{
                    "Content-Type":"application/json"
                },
                "body":JSON.stringify({
                    "urls": [img.src]
                })
            })
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data[0][0][0] && data[0][0][0] >= 0.62;
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}

processImages();
