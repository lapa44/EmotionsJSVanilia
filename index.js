let score;
let catImgUrl;
let photosArray;
let correctAnswer;
let correctRadio;
let modelFlag = 0;

const hideCategories = () => {
    document.getElementsByClassName('myHeader').item(0).innerHTML = 'Emotions Guesser!';
    for (let i = 1; i < 4; i++) {
        document.getElementsByClassName("cat" + i).item(0).style.display = 'none';
    }
}

const showCats = () => {
    document.getElementsByClassName('myHeader').item(0).innerHTML = 'Pick your category and guess emotions!';
    for (let i = 1; i < 4; i++) {
        document.getElementsByClassName("cat" + i).item(0).style.display = 'block';
    }
    hideGuesser();
}

const hideGuesser = () => {
    for (let i = 1; i < 5; i++) {
        document.getElementsByClassName('answer' + i).item(0).style.display = 'none';
    }
    document.getElementsByClassName('score').item(0).style.display = 'none';
    document.getElementsByClassName('picture').item(0).style.display = 'none';
    document.getElementsByClassName('buttonNext').item(0).style.display = 'none';
    document.getElementsByClassName('buttonChangeCat').item(0).style.display = 'none';
}

const showGuesser = () => {
    for (let i = 1; i < 5; i++) {
        document.getElementsByClassName('answer' + i).item(0).style.display = 'block';
    }
    document.getElementsByClassName('score').item(0).style.display = 'block';
    document.getElementsByClassName('picture').item(0).style.display = 'block';
    document.getElementsByClassName('buttonNext').item(0).style.display = 'block';
    document.getElementsByClassName('buttonChangeCat').item(0).style.display = 'block';
}

const hideLoader = () => {
    document.getElementsByClassName('loader').item(0).style.display = 'none';
}

const showLoader = () => {
    document.getElementsByClassName('loader').item(0).style.display = 'block';
}

const loadModels = async () => {
    if (modelFlag === 1) {
        return;
    }
    const MODEL_URL = './assets/models'
    await faceapi.loadSsdMobilenetv1Model(MODEL_URL)
    await faceapi.loadFaceLandmarkModel(MODEL_URL)
    await faceapi.loadFaceRecognitionModel(MODEL_URL)
    await faceapi.loadFaceExpressionModel(MODEL_URL)
    modelFlag = 1;
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
    hideCategories();
    photosArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    document.getElementsByClassName('endScores').item(0).style.display = 'none';
    showLoader();
    score = 0;
    catImgUrl = './assets/img/' + category + '/';
    loadModels().then(r => {
        console.log("Models loaded.")
        photosArray = faceapi.shuffleArray(photosArray);
        document.getElementsByClassName('score').item(0).innerHTML = "Twój wynik to: " + score;
        nextPhoto();
    });
}

const processGame = async () => {
    await checkAnswers();
    if (!nextPhoto()) {
        finishGame();
    }
}

const nextPhoto = () => {
    if (photosArray.length === 0) {
        return false;
    } else {
        showLoader();
        hideGuesser();
        document.getElementById('buttonNext').disabled = true;
        document.getElementById("picture").src = catImgUrl + photosArray.pop() + '.jpg';
        recognize().then(res => {
            correctAnswer = res[0][0];
            res = faceapi.shuffleArray(res);
            for (let i = 0; i < 4; i++) {
                document.getElementById('ans' + i).innerHTML = res[i][0];
                if (correctAnswer === res[i][0]) {
                    correctRadio = i;
                }
            }
            hideLoader();
            showGuesser();
            document.getElementById('buttonNext').disabled = false;
        })
        return true;
    }
}

const finishGame = () => {
    hideGuesser();
    document.getElementsByClassName('endScores').item(0).innerHTML = "You've got "
        + score + " of 10 points!<br><bold>Well done!</bold><br>You can try another category or the same if you want to beat your score!";
    document.getElementsByClassName('endScores').item(0).style.display = 'block';
    showCats();
    console.log("Finishing game.")
}

const checkAnswers = async () => {
    console.log("Checking answers.")
    document.getElementsByClassName('container').item(correctRadio).style.backgroundColor = 'green';
    if (document.getElementsByName('radio').item(correctRadio).checked) {
        document.getElementsByClassName('score').item(0).innerHTML = "Twój wynik to: " + ++score;
        document.getElementsByName('radio').item(correctRadio).checked = false;
    } else {
        for (let i = 0; i < 4; i++) {
            if (document.getElementsByName('radio').item(i).checked && i !== correctRadio) {
                document.getElementsByClassName('container').item(i).style.backgroundColor = 'red';
                document.getElementsByName('radio').item(i).checked = false;
            }
        }
    }
    await new Promise(r => setTimeout(r, 2000));
    for (let i = 0; i < 4; i++) {
        document.getElementsByClassName('container').item(i).style.backgroundColor = 'grey';
    }
    return false;
}

const clickRadio = (number) => {
    document.getElementsByName('radio').item(number).checked = true;
}
