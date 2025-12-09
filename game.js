const WIN_PATTERNS=[
[0,1,2],[3,4,5],[6,7,8],
[0,3,6],[1,4,7],[2,5,8],
[0,4,8],[2,4,6]
]
export default class Game{
constructor(){
this.board=Array(9).fill(null)
this.current='X'
this.scores={X:0,O:0,D:0}
this.over=false
}
reset(start){
this.board=Array(9).fill(null)
this.current=start||'X'
this.over=false
}
makeMove(i){
if(this.over||this.board[i])return false
this.board[i]=this.current
const winner=this.checkWin()
if(winner){
this.over=true
if(winner==='D')this.scores.D++
else this.scores[winner]++
}else{
this.current=this.current==='X'?'O':'X'
}
return true
}
checkWin(){
for(const p of WIN_PATTERNS){
const [a,b,c]=p
if(this.board[a]&&this.board[a]===this.board[b]&&this.board[a]===this.board[c])return this.board[a]
}
if(this.board.every(Boolean))return 'D'
return null
}
}