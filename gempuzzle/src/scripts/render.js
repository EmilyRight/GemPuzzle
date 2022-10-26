const body = document.querySelector('body');
export default function render() {
  body.innerHTML = `<header class="header">
    <div class="header__wrapper wrapper">
      <h1 class="title">Gem Puzzle</h1>
      <div class="burger__container">
        <span class="burger"></span>
      </div>
    </div>
    <nav class="settings">
      <div class="settings__wrapper wrapper">
        <ul class="settings__list">
          <li class="settings__list__item sound"><span class="settings__text ">Sounds on/off</span><span class="sound-icon"></span></li>
          <li class="settings__list__item">
            <span class="settings__text">Select level</span>
            <div class="game-lvls">
              <span class="game-lvl game-lvl_3">3 x 3</span>
              <span class="game-lvl game-lvl_4 chosen">4 x 4</span>
              <span class="game-lvl game-lvl_5">5 x 5</span>
              <span class="game-lvl game-lvl_6">6 x 6</span>
              <span class="game-lvl game-lvl_7">7 x 7</span>
              <span class="game-lvl game-lvl_8">8 x 8</span>
            </div>
          </li>
          <li class="settings__list__item best"> <div class="best-results-btn btn">Show best results</div></li>
        </ul>
      </div>
    </nav>
  </header>

  <main>
    <div class="wrapper">
      <div class="start-btns__block">
        <div class="save__block">
          <div class="save-btn btn_small">Save</div>
          <div class="play-save-btn btn_small">Play saved</div>
        </div>
        <div class="start-btn btn">Shiffle and start</div>

      </div>

      <div class="game-field__wrapper">
        <div class="game-field">
        </div>
      </div>
      <div class="stats-counter">
        <div class="steps-counter">
          Steps:&nbsp;<span class="steps-counter__num">0</span>
        </div>
        <div class="time-counter">
          Time:&nbsp;<span class="time-counter__num"
            ><span class="hours">00</span>:<span class="minutes">00</span
            >:<span class="seconds">00</span>
          </span>
        </div>
      </div>
      <div class="btn-controls__block">
        <div class="pause-btn btn">Pause</div>
        <div class="stop-btn btn">Stop</div>
      </div>
      <div class="best-score__block">
      </div>

      <div class="popup">
        <h3 class="popup__title">Congrats, winner!</h3>
        <div class="popup__score">
          Your score is&nbsp;<span class="popup__score__num">0</span>&nbsp;steps
        </div>
        <div class="popup__time">
          </span>
        </div>
        <div class="best-score__block">
        </div>
        <div class="bonus__block"></div>
        <div class="popup__burger__block">
          <span class="burger popup__burger"></span>
        </div>
      </div>
      <div class="best-results__popup">
        <h3 class="best-results__popup__title">Best results</h3>
        <ul class="best-results">
          <li class="best-results__item">
            <div class="best-results__size">Size
            </div>
            <div class="best-results__steps"> Steps
            </div>
          </li>
          <li class="best-results__item">
            <div class="best-results__size">3 x 3
            </div>
            <div class="best-results__steps" data-size="3">
            </div>
          </li>
          <li class="best-results__item">
            <div class="best-results__size">4 x 4
            </div>
            <div class="best-results__steps" data-size="4">
            </div>
          </li>
          <li class="best-results__item">
            <div class="best-results__size" >5 x 5
            </div>
            <div class="best-results__steps" data-size="5">
            </div>
          </li>
          <li class="best-results__item">
            <div class="best-results__size">6 x 6
            </div>
            <div class="best-results__steps" data-size="6">
            </div>
          </li>
          <li class="best-results__item">
            <div class="best-results__size">7 x 7
            </div>
            <div class="best-results__steps" data-size="7">
            </div>
          </li>
          <li class="best-results__item">
            <div class="best-results__size">8 x 8
            </div>
            <div class="best-results__steps" data-size="8">
            </div>
          </li>
        </ul>
        <div class="best-popup__burger__block">
          <span class="burger popup__burger best-results__popup__burger"></span>
        </div>
      </div>
    </div>
  </main>
  <footer>
    <audio class="audio move">
      <source src='./audio/move_3RgJF9KJ.mp3'>
     </audio>
     <audio class="audio start">
      <source src='./audio/start.mp3'>
     </audio>
    <a href="https://github.com/EmilyRight" target="blank" class="author"
      >By EmilyRight</a
    >
  </footer>`;
}
