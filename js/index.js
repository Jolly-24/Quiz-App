const quesContainer = document.getElementById("questionsContainer");
const selectCategory = document.getElementById("selectCategory");
const difficultyOptions = document.getElementById("difficultyOptions");
const questionsNumber = document.getElementById("questionsNumber");
const startBtn = document.getElementById("start");

let questions;
let myQuiz;
let myRow = document.querySelector("#row");

startBtn.addEventListener("click", async function () {
  let category = selectCategory.value;
  let difficulty = difficultyOptions.value;
  let number = questionsNumber.value;

  myQuiz = new Quiz(category, difficulty, number);
  questions = await myQuiz.getAllQuestions();

  let myQuestions = new Question(0);
  myQuestions.display(); // Ensure questions is populated
  console.log(myQuestions);

  quesContainer.classList.replace("d-flex", "d-none");
  console.log(questions);
});

class Quiz {
  constructor(category, difficulty, number) {
    this.category = category;
    this.difficulty = difficulty;
    this.number = number;
    this.score = 0;
  }

  geApi() {
    return `https://opentdb.com/api.php?amount=${this.number}&category=${this.category}&difficulty=${this.difficulty}`;
  }

  async getAllQuestions() {
    let response = await fetch(this.geApi());
    let data = await response.json();
    return data.results;
  }

  showResults(){
    return `
    
<div class="question shadow-lg col-lg-6 offset-lg-3 p-4 rounded-3 d-flex flex-column align-items-center justify-content-center gap-3 animate__animated animate__bounceIn mt-5">
<h2 class="m-0">
${this.score == this.number ? `Congrats ` : `your score is ${this.score} of ${this.number}` }
</h2>
<button class="again w-50 btn btn-primary rounded-pill">Try again</button>
</div>
    `;
  }
}

class Question {
  constructor(index) {
    this.index = index;
    this.question = questions[index].question;
    this.difficulty = questions[index].difficulty;
    this.category = questions[index].category;
    this.correct_answer = questions[index].correct_answer;
    this.incorrect_answers = questions[index].incorrect_answers;
    this.myAllAnswers = this.getAllAnswers();
    this.isAnswered = false;
  }

  getAllAnswers() {
    let allAnswers = [this.correct_answer, ...(Array.isArray(this.incorrect_answers) ? this.incorrect_answers : [this.incorrect_answers])];
    allAnswers.sort();
    return allAnswers;
  }

  display() {
    const questionMarkup = `
      <div class="question shadow-lg col-lg-6 offset-lg-3 p-4 rounded-3 d-flex flex-column align-items-center justify-content-center gap-3 animate__animated animate__backInLeft">
        <div class="w-100 d-flex justify-content-between">
          <span class="btn btn-category fs-6 ">${this.category}</span>
          <span class="fs-6 btn btn-questions text-center">${this.index + 1} of ${questions.length}</span>
        </div>
        <h2 class="text-capitalize h4 text-center">${this.question}</h2>
        <ul class="choices list-unstyled m-0 d-flex flex-wrap text-center row-gap-3 column-gap-3">
        ${this.myAllAnswers.map((answer)=>`<li>${answer}</li>`).toString().replaceAll(",","")}
        </ul>
        <h2 class="text-capitalize text-center h3 fw-bold">score: ${myQuiz.score}</h2>
      </div>
    `;
    myRow.innerHTML = questionMarkup;
    let allChoices =document.querySelectorAll(".choices li")
    allChoices.forEach( (li)=>{
      li.addEventListener("click" , ()=>{
        this.checkAnswer(li)
        this.nextQuestion()
      })
    }) 
  }
    checkAnswer(choice){
    if(this.isAnswered == false){
      this.isAnswered = true
      if(choice.innerHTML == this.correct_answer){
        myQuiz.score ++
        choice.classList.add('correct','animate__animated','animate__pulse')
      }else{
        choice.classList.add('wrong','animate__animated','animate__shakeX')
      }
    }
    }

    nextQuestion(){
        this.index++

        setTimeout(()=>{
          if(this.index < questions.length){
          let myNewQuestion = new Question(this.index)
          myNewQuestion.display()
         } else{
          let result = myQuiz.showResults()
          myRow.innerHTML = result
          document.querySelector(".again").addEventListener("click",function(){
            window.location.reload()
          })
         }
        },1500)
    }
 
}
