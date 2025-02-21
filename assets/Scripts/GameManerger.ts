import { _decorator, Component, instantiate, Label, Node, Prefab } from 'cc';
import { PlayerController } from './PlayerController';
const { ccclass, property } = _decorator;

enum BlockType {
    BT_NONE, //0
    BT_WHITE //1
}

enum GameState{
    GS_MENU,
    GS_PLAYING
}

@ccclass('GameManerger') //隨機地圖的產生
export class GameManerger extends Component {

    @property(Prefab)
    // @property(Node)
    public boxPrefab: Prefab = null;
    // public boxPrefab: Node = null;
    @property
    public roadLength = 50;

    // 定義地圖陣列
    private _road: BlockType[] = [];

    // 三、訪問PlayerController
    @property(PlayerController)
    public playerController: PlayerController = null;

    // 四、設置菜單是否隱藏, 使用StartMenu節點
    @property(Node)
    public startMenu:Node = null;

    @property(Label)
    public stepLabel:Label = null;


    start() {
        // 2-2遊戲開始由狀態切換
        // this.generateRoad();
        // 遊戲默認狀態為菜單頁面
        this.setCurState(GameState.GS_MENU);
        // 監聽JumpEnd事件
        this.playerController.node.on("JumpEnd", this.onJumpEnd, this)

        this.playerController.bodyAnim
    }
    
    
    // 二、遊戲狀態切換
    setCurState(value: GameState){
        if(value===GameState.GS_MENU){
            // 重製Menu位置
            this.playerController.reset();
            // 菜單頁面生成地圖磚
            this.generateRoad();
            // 步數顯示
            this.stepLabel.string = '0';
            // 3-2進入PlayController控制
            // if in MENU => can not controll => false
            this.playerController.setIsCanControll(false)
            // 4-2 menu顯示
            this.startMenu.active = true;
            
        }else if(value===GameState.GS_PLAYING){
            // if in PLAYING => can not controll => true
            this.playerController.setIsCanControll(true)
            // 4-2 menu隱藏
            this.startMenu.active = false;
        }
    }

    // 五、Button點擊方法
    // onStartButtonClick(event: Event, customEventData: string){}
    onStartButtonClick(){
        // console.log(event)
        this.setCurState(GameState.GS_PLAYING);
    }

    onJumpEnd(value:number){
        this.stepLabel.string = value.toString();

        this.checkResult(value);
    }

    // 判斷格子是否在地圖磚上
    checkResult(totalStep:number){
        // 遊戲結束: 格子跳完
        if(totalStep>=this.roadLength){
            this.setCurState(GameState.GS_MENU)
        }else{
            // 遊戲進行中: player站在空的地圖上 => 顯示menu
            if(this._road[totalStep]==BlockType.BT_NONE){
                this.setCurState(GameState.GS_MENU)
            }
        }
    }

    generateRoad() {
        // 清除所有子節點 => 初始化
        this.node.removeAllChildren();

        this._road = [];

        // 初始化第一塊磚
        this._road.push(BlockType.BT_WHITE);
        // console.log(this._road)

        // 最多只能空兩格
        for (let i = 1; i < this.roadLength; i++) {

            if (this._road[i - 1] === BlockType.BT_NONE) {
                this._road.push(BlockType.BT_WHITE);
            } else {
                this._road.push(Math.round(Math.random()));
            }

        }

        // 設定地圖磚的位置
        for (let j = 1; j < this.roadLength; j++) {
            if (this._road[j] == BlockType.BT_WHITE) {
                // 複製新的節點
                const box = instantiate(this.boxPrefab);
                // 設定新節點node和位置
                box.setParent(this.node);
                box.setPosition(j * 40, 0, 0);
            }
        }
    }
}

