import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;

enum BlockType {
    BT_NONE, //0
    BT_WHITE //1
}

@ccclass('GameManerger') //隨機地圖的產生
export class GameManerger extends Component {

    @property(Prefab)
    // @property(Node)
    public boxPrefab: Prefab = null;
    // public boxPrefab: Node = null;
    // @property
    public roadLength = 5;

    private _road: BlockType[] = [];

    start() {
        this.generateRoad();
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

