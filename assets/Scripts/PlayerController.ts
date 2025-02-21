import { _decorator, Animation, Component, EventKeyboard, EventMouse, input, Input, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {

    private _startJump = false;
    // 每次jump時間
    private _jumpTime = 0.2;
    // 總共花費時間
    private _curJumpTime = 0;
    // jump速度
    private _jumpSpeed = 0;
    private _targetPos = new Vec3();
    private _curPos = new Vec3();

    @property(Animation)
    public bodyAnim: Animation = null;



    start() {
        // 監測鼠標事件input.on(eventType, thisObject, listener);
        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        // console.log()
        // console.log(this);
        // console.log(this.bodyAnim.node)
        // console.log(this.bodyAnim.clips)
    }


    onMouseDown(event: EventMouse) {
        // getButton()===0左鍵 1滾輪 2右鍵
        // event.getButton()===2
        // 左鍵一步 右鍵兩步
        if (event.getButton() == 0) {
            this.jumpByStep(1);
        } else if (event.getButton() == 2) {
            this.jumpByStep(2);
        }
    }

    // 移動x軸
    jumpByStep(step: number) {
        // 一、直接更改方塊位置:缺少動畫感
        // const curPos = this.node.position;
        // this.node.setPosition(curPos.x+40*step, curPos.y, curPos.z)

        // 2-4.避免在移動過程中, 重新執行函數
        if (this._startJump) return;

        // 四、跳躍動畫與位置不一致
        const animName = step == 1 ? 'JumpOneStep' : 'JumpTwoStep';
        const animState = this.bodyAnim.getState(animName);
        // console.log(animName)
        // console.log(animState)
        this._jumpTime = animState.duration;
        // console.log(this._jumpTime)

        const moveLength = step * 40;
        this._startJump = true;
        this._curJumpTime = 0
        this._jumpSpeed = moveLength / this._jumpTime;

        // 二、讓方塊位置更精準:
        // 2-1.將當前位置傳入_curPos變數
        this._curPos = this.node.position;
        // this.node.getPosition(this._curPos);

        // 2-2.取得目標位置
        // this._targetPos = new Vec3(this._curPos.x+moveLength, this._curPos.y, this._curPos.z)
        // Vec3.add(相加結果, 目標位置, 偏移) => 將目標位置與三維向量數值相加
        Vec3.add(this._targetPos, this._curPos, new Vec3(moveLength, 0, 0))

        // 三、新增跳躍動畫
        // if(step==1){
        //     this.bodyAnim.play("JumpOneStep");
        // }else if(step==2){
        //     this.bodyAnim.play("JumpTwoStep");
        // }
        // 4-1 animName 取代判斷
        this.bodyAnim.play(animName);

    }

    // 設定動畫移動的速度:避免動畫楨數與方塊跳躍結束時間不同
    protected update(dt: number): void {
        if (this._startJump) {
            this._curJumpTime += dt;
            if (this._curJumpTime > this._jumpTime) {
                this._startJump = false;
                // 2-3.更新方塊位置
                this.node.setPosition(this._targetPos);
            } else {
                const curPos = this.node.position;
                this.node.setPosition(curPos.x + this._jumpSpeed * dt, curPos.y, curPos.z)
            }
        }
    }


    protected onDestroy(): void {
        // input.off(eventType, thisObject, listener);
        input.off(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
    }
}

