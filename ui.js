export default class UI {
  constructor(game) {
    this.game = game
    this.boardEl = document.getElementById('board')
    this.cells = Array.from(this.boardEl.querySelectorAll('.cell'))
    this.statusEl = document.getElementById('status')
    this.restartBtn = document.getElementById('restart')
    this.aiToggle = document.getElementById('aiToggle')
    this.firstSelect = document.getElementById('firstPlayer')
    this.scoreX = document.getElementById('scoreX')
    this.scoreO = document.getElementById('scoreO')
    this.scoreD = document.getElementById('scoreD')
    this.isAI = false
  }

  init() {
    this.loadScores()
    this.bind()
    this.start()
  }

  bind() {
    this.boardEl.addEventListener('click', e => {
      const btn = e.target.closest('.cell')
      if (!btn) return
      const i = Number(btn.dataset.index)
      if (!this.game.makeMove(i)) return
      this.render()
      if (this.isAI && !this.game.over) requestAnimationFrame(() => this.aiMove())
    })

    this.restartBtn.addEventListener('click', () => this.start())
    this.aiToggle.addEventListener('click', () => {
      this.isAI = !this.isAI
      this.aiToggle.textContent = this.isAI ? 'CPU On' : 'Play vs CPU'
      if (this.isAI && this.game.current === 'O' && !this.game.over) requestAnimationFrame(() => this.aiMove())
    })
    this.firstSelect.addEventListener('change', e => {
      this.start(e.target.value)
    })
    window.addEventListener('keydown', e => {
      if (e.key === 'r' || e.key === 'R') this.start()
    })
  }

  start(first) {
    const starter = first || this.firstSelect.value || 'X'
    this.game.reset(starter)
    this.render()
    if (this.isAI && this.game.current === 'O') requestAnimationFrame(() => this.aiMove())
  }

  render() {
    this.cells.forEach((c, i) => {
      c.textContent = this.game.board[i] || ''
      c.disabled = !!this.game.board[i] || this.game.over
    })
    const winner = this.game.checkWin()
    if (winner === 'D') this.statusEl.textContent = 'Draw'
    else if (winner) this.statusEl.textContent = `${winner} wins`
    else this.statusEl.textContent = `Player ${this.game.current}'s turn`
    this.updateScores()
  }

  updateScores() {
    this.scoreX.textContent = this.game.scores.X
    this.scoreO.textContent = this.game.scores.O
    this.scoreD.textContent = this.game.scores.D
    localStorage.setItem('tttScores', JSON.stringify(this.game.scores))
  }

  loadScores() {
    const s = localStorage.getItem('tttScores')
    if (s) {
      try {
        this.game.scores = JSON.parse(s)
      } catch (e) {}
    }
  }

  aiMove() {
    const best = this.bestMove([...this.game.board], 'O')
    if (best !== null) {
      this.game.makeMove(best)
      this.render()
    }
  }

  bestMove(board, player) {
    const opponent = player === 'X' ? 'O' : 'X'
    const winner = this.staticCheck(board)
    if (winner) return null
    const empty = board.map((v, i) => (v ? null : i)).filter(v => v !== null)
    let best = null
    let bestScore = -Infinity
    for (const i of empty) {
      board[i] = player
      const score = this.minimax(board, false, player, opponent)
      board[i] = null
      if (score > bestScore) {
        bestScore = score
        best = i
      }
    }
    return best
  }

  minimax(board, isMax, player, opponent) {
    const winner = this.staticCheck(board)
    if (winner === player) return 10
    if (winner === opponent) return -10
    if (winner === 'D') return 0
    const empties = board.map((v, i) => (v ? null : i)).filter(v => v !== null)
    if (isMax) {
      let best = -Infinity
      for (const i of empties) {
        board[i] = player
        best = Math.max(best, this.minimax(board, false, player, opponent))
        board[i] = null
      }
      return best
    } else {
      let best = Infinity
      for (const i of empties) {
        board[i] = opponent
        best = Math.min(best, this.minimax(board, true, player, opponent))
        board[i] = null
      }
      return best
    }
  }

  staticCheck(board) {
    const patterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ]
    for (const p of patterns) {
      const [a, b, c] = p
      if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a]
    }
    if (board.every(Boolean)) return 'D'
    return null
  }
}
