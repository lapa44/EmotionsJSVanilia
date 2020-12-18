let score = 0;
let counter = 1;
let catImgUrl;
let photosArray = [1,2,3,4,5,6,7,8,9,10];
let correctAnswer;
let correctRadio;

const hideCategories = () => {
    for (let i = 1; i < 4; i++) {
        document.getElementsByClassName("cat" + i).item(0).style.display = 'none';
    }
}

const showCats = () => {
    for (let i = 1; i < 4; i++) {
        document.getElementsByClassName("cat" + i).item(0).style.display = 'block';
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
    })
        .slice(0, 4);
}

const startGame = (category) => {
    // moze ladowac 10 zdjec i pasek ladowania 0-100% co 10%
    score = 0;
    counter = 1;
    catImgUrl = './assets/img/' + category + '/';
    loadModels().then(r => {
        console.log("Models loaded.")
        hideCategories();
        photosArray = faceapi.shuffleArray(photosArray);
        document.getElementsByClassName('score').item(0).innerHTML = "Twój wynik to: " + score;
        nextPhoto();
    });
}

const processGame = async () => {
    checkAnswers();
    if (!nextPhoto()) {
        finishGame();
    }
}

const nextPhoto = () => {
    if (counter === 10) {
        return false;
    } else {
        //todo loader start
        document.getElementById('buttonNext').setAttribute('disabled', 'true');
        document.getElementById("picture").src = catImgUrl + counter++ + '.jpg';
        recognize().then(res => {
            correctAnswer = res[0][0];
            faceapi.shuffleArray(res);
            for (let i = 0; i < 4; i++) {
                document.getElementById('ans' + i).innerHTML = res[i][0];
                if (correctAnswer === res[i][0]) {
                    correctRadio = i;
                }
            }
            document.getElementById('ans0').innerHTML = res[0][0];
            document.getElementById('ans1').innerHTML = res[1][0];
            document.getElementById('ans2').innerHTML = res[2][0];
            document.getElementById('ans3').innerHTML = res[3][0];
            document.getElementById('buttonNext').setAttribute('disabled', 'false');
        })
        //todo loader stop
        return true;
    }
}

const finishGame = () => {
    //todo finish game x points of 10
    console.log("Finishing game.")
}

const checkAnswers = () => {
    console.log("Checking answers.")
    if (document.getElementsByName('radio').item(correctRadio).checked) {
        document.getElementsByClassName('score').item(0).innerHTML = "Twój wynik to: " + ++score;
        return true;
    }
    return false;
}
