let app = new Vue({
    el: '#simon_says',
    data: {
        buttons: {
            red: 'red',
            blue: 'blue',
            green: 'green',
            yellow: 'yellow'
        },
        steps: [],
        clickCounter: 0,
        playersMove: false,
        gameInProcess: false,
        gameOver: false,
        gameSpeed: 'easy',
        speedTable: {
            easy: 1500,
            normal: 1000,
            hard: 400
        },
        intervalBetweenClicks: ''

    },
    created: function () {
        this.setSpeed();
    },
    methods: {
        startGame: function () {
            if(!this.gameInProcess) {
                this.clearGame();
                this.gameInProcess = true;
                this.startAiMove();
            }
        },
        startAiMove: function () {
            const nameButton = this.getRandomButton();
            this.steps.push(nameButton);
            setTimeout(() => { //Комфотная задержка между кликом игроком на кнопку "Старт" и началом подсветки кнопок
                this.walkUpTheSteps(0);
            }, 400);
        },
        walkUpTheSteps: function (stepNumber) {
            if(stepNumber < this.steps.length) {
                const buttonsName = this.steps[stepNumber];
                this.playSound(buttonsName);
                this.buttons[buttonsName] = buttonsName + ' active_button';//Подсвечиваем кнопку
                setTimeout(() => {
                    this.buttons[this.steps[stepNumber]] = this.steps[stepNumber];//Снимаем подсветку
                    setTimeout(()=> {
                        this.walkUpTheSteps(stepNumber+1);
                    }, 200);
                },700);
            } else {
                this.playersMove = true;
            }
        },
        getRandomButton: function () {
            const buttonsArray = Object.keys(this.buttons);
            const numberButton = Math.floor(Math.random() * buttonsArray.length);
            return this.buttons[buttonsArray[numberButton]];
        },
        startPlayersMove: function (buttonColor) {
            if(this.playersMove) {
                this.playSound(buttonColor);
                this.buttons[buttonColor] = buttonColor + ' active_button';//Подсвечиваем кнопку
                this.checkGamesStep(buttonColor);//Отправляем на проверку
                setTimeout(() => {
                    this.buttons[buttonColor] = buttonColor;//Снимаем подсветку
                },100);
            }
        },
        checkGamesStep: function (buttonColor) {
            if(buttonColor === this.steps[this.clickCounter]) { //Верный клик
                this.clickCounter++;
                this.checkInterval(this.clickCounter);
                if(this.clickCounter === this.steps.length) { //Проверка на последний клик в раунде
                    this.playersMove = false;
                    this.clickCounter = 0;
                    setTimeout(()=> { // Комфортная задержка между последним кликом игрока и началом хода ИИ
                        this.startAiMove();
                    }, 400);
                }
            } else { //Ошибка игрока
                this.endingGame();
            }
        },
        checkInterval: function (stepNumber) {
            if(this.playersMove) {
                setTimeout(() => {
                    if(stepNumber === this.clickCounter) {
                        this.endingGame();
                    }
                }, this.intervalBetweenClicks);
            }
        },
        endingGame: function () {
            this.gameOver = true;
            this.gameInProcess = false;
        },
        clearGame: function () {
            this.steps = [];
            this.clickCounter = 0;
            this.playersMove = false;
            this.gameInProcess = false;
            this.gameOver = false;
        },
        setSpeed: function () {
            this.intervalBetweenClicks = this.speedTable[this.gameSpeed];
        },
        playSound: function (buttonName) {
            const audio = document.createElement('audio');
            const audioArea = document.querySelector('#audio');
            const types = ['mp3', 'ogg'];
            types.forEach(type => {
                const source = document.createElement('source');
                source.src = 'sounds/' + buttonName + '.' + type;
                source.type = 'audio/' + type;
                audio.appendChild(source);
            });
            audio.autoplay = true;
            audioArea.innerHTML = '';
            audioArea.appendChild(audio);
        }
    },
    computed: {
        round: function () {
            return this.steps.length;
        }
    },
    watch: {
        gameSpeed: function () {
            this.setSpeed();
        }
    }
})
Vue.config.devtools = true;
