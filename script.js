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
        gameOver: false
    },
    created: function() {

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
                this.buttons[this.steps[stepNumber]] = this.steps[stepNumber] + ' active_button';//Подсвечиваем кнопку
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
                if(this.clickCounter === this.steps.length) {
                    this.playersMove = false;
                    this.clickCounter = 0;
                    setTimeout(()=> { // Комфортная задержка между последним кликом игрока и началом хода ИИ
                        this.startAiMove();
                    }, 400);
                }
            } else { //Ошибка игрока
                this.gameOver = true;
                this.gameInProcess = false;
            }
        },
        clearGame: function () {
            this.steps = [];
            this.clickCounter = 0;
            this.playersMove = false;
            this.gameInProcess = false;
            this.gameOver = false;
        }
    },
    computed: {
        round: function () {
            return this.steps.length;
        }
    }
})
