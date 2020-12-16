let score = 0;
let counter = 1;
let catImgUrl;
let photosArray = [1,2,3,4,5,6,7,8,9,10];

const hideCategories = () => {
    for (let i = 1; i < 4; i++) {
        document.getElementsByClassName("cat" + i).item(0).style.visibility = 'hidden';
        document.getElementsByClassName("cat" + i).item(0).style.maxWidth = '1px';
        document.getElementsByClassName("cat" + i).item(0).style.maxHeight = '1px';
    }
}

const showCats = () => {
    for (let i = 1; i < 4; i++) {
        document.getElementsByClassName("cat" + i).item(0).style.visibility = 'visible';
        document.getElementsByClassName("cat" + i).item(0).style.maxWidth = '100%';
        document.getElementsByClassName("cat" + i).item(0).style.maxHeight = '100%';
    }
}

const loadModels = async () => {
    const MODEL_URL = './assets/models'
    await faceapi.loadSsdMobilenetv1Model(MODEL_URL)
    await faceapi.loadFaceLandmarkModel(MODEL_URL)
    await faceapi.loadFaceRecognitionModel(MODEL_URL)
    await faceapi.loadFaceExpressionModel(MODEL_URL)
}

const recognize = async () => {
    const input = document.getElementById("picture");
    const detectionsWithExpressions = await faceapi.detectAllFaces(input).withFaceExpressions();
    return Object.entries(detectionsWithExpressions[0]['expressions'])
        .sort(function (a, b) {
        return b[1] - a[1];
    });
}

const startGame = (category) => {
    score = 0;
    counter = 1;
    catImgUrl = './assets/img/' + category + '/';
    loadModels().then(r => console.log("Models loaded."));
    hideCategories();
    photosArray = faceapi.shuffleArray(photosArray);
    document.getElementsByClassName('score').item(0).innerHTML = "Twój wynik to: " + score;
    nextPhoto();
}

const processGame = async () => {
    recognize().then(res => {
        checkAnswers(res);
        if (!nextPhoto()) {
            finishGame();
        }
    })

}

const nextPhoto = () => {
    if (counter === 10) {
        return false;
    } else {
        document.getElementById("picture").src = catImgUrl + counter++ + '.jpg';
        return true;
    }
}

const finishGame = () => {
    console.log("Finishing game.")
}

const checkAnswers = ( results ) => {
    console.log(results);
    console.log("Checking answers.")
}
