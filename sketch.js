//let initialObstacleSpeed = 0.1; // 初期速度を外で定義; // 初期の速度
//let obstacleSpeed = initialObstacleSpeed; // ゲーム中で使う速度

const INITIAL_OBSTACLE_SPEED = 0.1; // 最初の障害物速度
let obstacleSpeed = INITIAL_OBSTACLE_SPEED; // ゲーム中ずっと同じ速度で進行

// ゲーム開始フラグ

let enemyHP = 100; // 敵の初期HP
const enemyHpBar = document.getElementById("enemyHpBar");

// HP設定
let playerHP  // プレイヤーのHP
let lastHitTime = Date.now(); // 最後に被弾した時間
let maxPlayerHP = 3;

// 吸収した障害物の色を追跡するための変数
let lastAbsorbedColor = null;
let consecutiveAbsorbs = 0; // 連続吸収回数

// ビーム発射のための設定
let beam = null;
let beamSpeed = 0.2;
let isBeamFiring = false; // ビームが発射されている状態を管理する変数
let isBeamReady = false; // ビームが準備完了しているかを管理する変数
let destroyedObstacles = 0; // 破壊された障害物の数


// シーン、カメラ、レンダラーの設定
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10); // カメラを斜め上に配置
camera.lookAt(0, 0, 0); // シーンの中心を向く

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// スタート画面の要素
const startScreen = document.getElementById('startScreen');
const startButton = document.getElementById('startButton');

// HPバーの要素
const hpBar = document.getElementById('hpBar');

// リトライボタンの要素
const retryButton = document.getElementById('retryButton');

// スタートボタンのクリックイベント
startButton.addEventListener('click', () => {
    startScreen.style.display = 'none'; // スタート画面を非表示
    startGame(); // ゲームを開始
    createObstacle();
});

// リトライボタンのクリックイベント
retryButton.addEventListener('click', () => {
    retryButton.style.display = 'none'; // リトライボタンを非表示
    resetGame(); // ゲームをリセット
    startGame(); // ゲームを再開
});

// ゲーム開始関数
function startGame() {
    isPaused = false; // ポーズを解除
    playerHP = 3; // HPを初期化
    enemyHP = 100
    updateHPBar(); // 初期のHPバーを表示
    document.addEventListener('keydown', handlePlayerInput); // キー入力イベントを追加
    retryButton.style.display = 'none'; // リトライボタンを非表示
    gameLoop(); // ゲームループを開始
   
    
}

// HPバーを更新する関数
function updateHPBar() {
    const hpPercentage =  playerHP / maxPlayerHP; // 最大HPは3
    hpBar.style.width = `${hpPercentage * 100}%`; // HPに応じて幅を変更
}
// ランダムな色を生成する関数
function getRandomColor() {
    // 4色をランダムに生成
    const colors = ['#ff0000', '#ffff00', '#0000ff', '#008000']; // 赤、黄色、青、緑
    // 配列からランダムに色を選択
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}




// ゲームオーバー処理
function gameOver() {
    isPaused = true; // ゲームを一時停止
    retryButton.style.display = 'block'; // リトライボタンを表示
}

// レーンの設定
const laneWidth = 1.8; // レーンの幅
const laneCount = 4; // レーンの数
const laneMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.5 });

// 各レーンを作成
for (let i = 0; i < laneCount; i++) {
    const laneGeometry = new THREE.PlaneGeometry(laneWidth, 20); // レーンの幅と長さ
    const lane = new THREE.Mesh(laneGeometry, laneMaterial);
    lane.rotation.x = -Math.PI / 2; // 地面に対して平行にする
    lane.position.x = (i - (laneCount - 1) / 2) * laneWidth; // レーンの位置を設定
    lane.position.y = 0; // 地面に配置
    lane.position.z = 0; // z軸の位置
    scene.add(lane);
}

// プレイヤーの設定
const playerGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const playerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.position.set(0, 0.25, 7); // プレイヤーを手前に配置
scene.add(player);

// プレイヤーのオーラ色を保存する変数
let playerAuraColor = null;

// プレイヤーを描画する関数内でオーラを追加
function drawPlayer(ctx, x, y) {
    if (playerAuraColor) {
        // オーラを描画 (プレイヤーの少し外側に大きめの円を描画)
        ctx.beginPath();
        ctx.arc(x, y, playerSize + 10, 0, Math.PI * 2);
        ctx.fillStyle = playerAuraColor;
        ctx.globalAlpha = 0.3; // オーラの透明度
        ctx.fill();
        ctx.globalAlpha = 1.0; // 透明度をリセット
    }
}

let isInvincible = false; // 無敵状態かどうかを示すフラグ


function playerHit() {
    if (!isInvincible) { // 無敵状態でない場合のみ被弾処理を行う
        playerHP -= 1; // HPを1減らす
        updateHPBar(); // HPバーを更新
        lastHitTime = Date.now(); // 被弾時間を更新
        activateInvincibility(); // 無敵時間を開始
    }
}

// 無敵時間を5秒間設定
function activateInvincibility() {
    isInvincible = true; // 無敵状態を有効化

    setTimeout(() => {
        isInvincible = false; // 5秒後に無敵状態を解除
    }, 5000);
}
 // ゲームループの中でプレイヤーが障害物に当たった場合に呼び出される処理
function checkCollisionWithObstacle(obstacle) {
    const playerBoundingBox = new THREE.Box3().setFromObject(player);
    const obstacleBoundingBox = new THREE.Box3().setFromObject(obstacle);

    if (playerBoundingBox.intersectsBox(obstacleBoundingBox)) {
        playerHit(); // プレイヤーが障害物に衝突した場合に被弾処理を行う
    }
}

// 障害物リスト
let obstacles = [];




// ポーズ状態
let isPaused = false; // 初期はポーズなし

// 障害物の生成関数（障害物ごとにバウンディングボックスを設定）
function createObstacle() {
    const obstacleMaterial = new THREE.MeshBasicMaterial({ color: getRandomColor() }); // ランダムな色を設定
    let obstacle;

    if (Math.random() < 0.5) {
        const obstacleGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
    } else {
        const obstacleGeometry = new THREE.BoxGeometry(0.5, 5, 0.5);
        obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
    }
    
    
   // プレイヤーの位置に合わせて障害物の生成位置を決定
   obstacle.position.x = player.position.x; // プレイヤーのx座標と一致
   obstacle.position.y = 0.25; // 障害物を低い位置に配置
   obstacle.position.z = -5; // 障害物が画面外から現れる位置
    // バウンディングボックスを有効化
    obstacle.geometry.computeBoundingBox();
    obstacle.boundingBox = new THREE.Box3().setFromObject(obstacle);
    
    scene.add(obstacle);
    obstacles.push(obstacle);
}

function updateObstacles() {
    // 障害物の移動処理 (加速をしないように初期速度で固定)
    obstacles.forEach((obstacle) => {
        obstacle.position.z += obstacleSpeed; // 障害物は常に一定速度で進む
        if (obstacle.position.z > 10) { // 画面外に出た障害物を削除
            scene.remove(obstacle);
            obstacles = obstacles.filter(o => o !== obstacle);
        }
    });
}

// プレイヤーの状態
let isJumping = false;
let jumpVelocity = 0;
const gravity = 0.06; // 重力

// ポーズ機能のキーイベント
document.addEventListener('keydown', (e) => {
    if (e.key === 'p' || e.key === 'P') {
        isPaused = !isPaused; // ポーズのON/OFFを切り替え
    }
});

// 被弾した時に呼び出される関数
function takeDamage() {
    if (playerHP > 0) {
        playerHP -= 1;
        updateHPBar(); // HPバーを更新
        lastHitTime = Date.now(); // 被弾時間を記録
    }

    if (playerHP <= 0) {
        gameOver(); // HPが0になったらゲームオーバー
    }
} 
// 10秒間被弾していないかをチェックする関数
function checkAndRecoverHP() {

     // ポーズ中であれば処理をスキップ
     if (isPaused) {
        return;
    }
    const currentTime = Date.now();
    const timeSinceLastHit = (currentTime - lastHitTime) / 1000; // 秒に変換
    console.log()

    // HPが2以下かつ10秒間被弾していない場合にHPを1回復
    if (playerHP < maxPlayerHP && playerHP <= 2 && timeSinceLastHit >= 10) {
        playerHP += 1;
        updateHPBar(); // HPバーを更新
        lastHitTime = Date.now(); // HP回復後、被弾時間をリセット
    }else {
        return;
    }
}


// プレイヤーの入力処理
function handlePlayerInput(e) {
    if (!isPaused) {
        if (e.key === "ArrowLeft") {
            player.position.x -= laneWidth;
        }
        if (e.key === "ArrowRight") {
            player.position.x += laneWidth;
        }
        if (e.key === " " && !isJumping) {
            isJumping = true;
            jumpVelocity = 0.5; // ジャンプの初速度
        }

        const laneBoundary = (laneCount - 1) * laneWidth / 2;

        if (player.position.x < -laneBoundary) {
            player.position.x = -laneBoundary;
        }
        if (player.position.x > laneBoundary) {
            player.position.x = laneBoundary;
        }
    }
}

// Aボタンを押した時に障害物を吸収する
document.addEventListener('keydown', (e) => {
    if (e.key === 'a' || e.key === 'A') {
        if (isBeamReady) {
            // ビームが準備完了している場合、ビームを発射
            fireBeam();
            isBeamReady = false; // ビームが発射されたので準備完了状態をリセット
        } else {
            // 障害物を吸収する処理
            absorbObstacle();
        }
    }
});

// ビームを発射する関数
function fireBeam() {
    if (isBeamFiring) return; // すでにビームが発射されている場合は何もしない
    destroyedObstacles = 0; // 破壊された障害物のカウントをリセット
    beam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 5, 32),
        new THREE.MeshBasicMaterial({ color: parseInt(lastAbsorbedColor, 16) })
    );
    beam.rotation.x = Math.PI / 2;
    beam.position.set(player.position.x, player.position.y, player.position.z);
    scene.add(beam);
    isBeamFiring = true;

    // ビームを発射後、進行方向にある障害物を破壊
    destroyObstaclesInPath();
}

// 障害物を吸収する関数
function absorbObstacle() {
    let nearestObstacle = null;
    let minDistance = Infinity;

    //playerAuraColor = obstacleColor;

    obstacles.forEach((obstacle) => {
        const distance = player.position.distanceTo(obstacle.position);
        if (distance < minDistance) {
            minDistance = distance;
            nearestObstacle = obstacle;
        }
    });

    if (nearestObstacle && minDistance < 2) { // 障害物がプレイヤーの近くにある場合
        const obstacleColor = nearestObstacle.material.color.getHexString();

        // 同じ色の障害物を2回連続で吸収した場合、ビームを発射する準備を整える
        if (obstacleColor === lastAbsorbedColor) {
            consecutiveAbsorbs++;
            if (consecutiveAbsorbs >= 2) {
                isBeamReady = true; // ビームの準備完了
                consecutiveAbsorbs = 0; // 連続回数をリセット
            }
        } else {
            consecutiveAbsorbs = 1; // 新しい色を吸収した場合、連続回数をリセット
        }

        lastAbsorbedColor = obstacleColor; // 吸収した色を記録

        // 吸収した障害物を削除
        scene.remove(nearestObstacle);
        obstacles = obstacles.filter((obstacle) => obstacle !== nearestObstacle);
    }
}


// ビームを発射する関数
function fireBeam() {
    // 破壊された障害物のカウントをリセット
    destroyedObstacles = 0;
    beam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 5, 32),
        new THREE.MeshBasicMaterial({ color: parseInt(lastAbsorbedColor, 16) })
    );
    beam.rotation.x = Math.PI / 2;
    beam.position.set(player.position.x, player.position.y, player.position.z);
    scene.add(beam);
    isBeamFiring = true;

        // ビームを発射後、進行方向にある障害物を破壊
        destroyObstaclesInPath();
}

// ビームと障害物が衝突するかを判定する関数
function checkBeamCollision(beam, obstacle) {
    // ビームのバウンディングボックスを取得
    const beamBoundingBox = new THREE.Box3().setFromObject(beam);
    
    // 障害物のバウンディングボックスを取得
    const obstacleBoundingBox = new THREE.Box3().setFromObject(obstacle);

    // ビームと障害物のバウンディングボックスが交差しているかを判定
    return beamBoundingBox.intersectsBox(obstacleBoundingBox);
}

function checkBeamEnemyCollision(beam, enemy) {
    // ビームの位置からバウンディングボックスを取得
    const beamBoundingBox = new THREE.Box3().setFromObject(beam);
    

    // 敵の位置からバウンディングボックスを取得
    const enemyBoundingBox = new THREE.Box3().setFromObject(enemy);
    

    // ビームと敵のバウンディングボックスが交差しているかを判定
    const isColliding = beamBoundingBox.intersectsBox(enemyBoundingBox);
    return isColliding;
}


// ビームが敵に当たった場合の処理
function handleBeamHitEnemy() {
    if (checkBeamEnemyCollision(beam, largeEnemy)) {
        // 敵にダメージを与える
        if (enemyHP > 0) {
            enemyHP -= 10;  // ダメージを10に設定
            console.log(`Enemy HP: ${enemyHP}`);
            // 敵のHPが0以下ならシーンから削除
            if (enemyHP <= 0) {
                console.log("Enemy destroyed!");
                scene.remove(largeEnemy); // 敵をシーンから削除
                enemyHpBar.style.display = 'none';
            }else{
                 // 敵のHPバーを更新
                 updateEnemyHPBar(enemyHP);
            }
        }

        // ビームもシーンから削除し、発射状態を解除
        scene.remove(beam);
        isBeamFiring = false;
    }
}



// ビームを進行方向にある障害物を破壊する関数
function destroyObstaclesInPath() {
    // プレイヤーの目の前にある障害物を距離でソートし、近い順に2つまで選ぶ
    const obstaclesInPath = obstacles
        .filter(obstacle => obstacle.position.z < player.position.z) // プレイヤーの前にある障害物のみ
        .sort((a, b) => a.position.distanceTo(player.position) - b.position.distanceTo(player.position))
        .slice(0, 2); // 近い順に2つを選択


        obstaclesInPath.forEach(obstacle => {
            const obstacleBoundingBox = new THREE.Box3().setFromObject(obstacle);
            const beamBoundingBox = new THREE.Box3().setFromObject(beam);
    
            // 衝突判定: ビームのバウンディングボックスと障害物のバウンディングボックスが交差するか
            if (beamBoundingBox.intersectsBox(obstacleBoundingBox)) {
                scene.remove(obstacle); // 障害物を削除
                obstacles = obstacles.filter(o => o !== obstacle); // 配列からも削除
                destroyedObstacles++; // 破壊された障害物のカウントを増やす
            }
        });
}

// ビームの更新処理
function updateBeam() {
    if (isBeamFiring && beam) {
        beam.position.z -= beamSpeed; // Z軸に沿ってビームを前進

         // ビームが画面奥まで到達した場合、シーンから削除
         if (beam.position.z <= -10) {
            scene.remove(beam);
            isBeamFiring = false;
        }

          // ビームと敵の衝突判定を実行
          handleBeamHitEnemy();

        // ビームと障害物の衝突判定
        obstacles.forEach((obstacle, index) => {
            if (checkBeamCollision(beam, obstacle)) {
                // 障害物を削除
                scene.remove(obstacle);
                obstacles.splice(index, 1);
                destroyedObstacles++; // 破壊された障害物をカウント

                // 障害物が2つ破壊された場合、ビームを削除
                if (destroyedObstacles >= 2) {
                    scene.remove(beam);
                    isBeamFiring = false;
                    destroyedObstacles = 0; // カウントをリセット
                }
            }
        });
    }
}


let largeEnemy = createEnemy({ x: 0, y: 0, z: -15 }); 

// 敵オブジェクトにHPを持たせる
function createEnemy(x, y) {
    const enemy = {
        position: new THREE.Vector3(x, y, 0),
        hp: 10, // 敵のHP
        // そのほか敵のプロパティ
    };
    return enemy;
}

// 敵のHPを更新する関数
function updateEnemyHPBar(enemyHP) {
    const hpPercentage = Math.max(0, enemyHP) / 100; // 敵の最大HPは100
    enemyHpBar.style.width = `${hpPercentage * 100}%`; // HPバーの幅を更新

    if (enemyHP <= 0) {
        enemyHpBar.style.display = 'none'; // 敵が倒されたらHPバーを非表示にする
    } else {
        enemyHpBar.style.display = 'block'; // 敵が生きていればHPバーを表示
    }
}

// 敵にダメージを与える関数
function damageEnemy(damage) {
    enemyHP = Math.max(0, enemyHP - damage); // HPが負の値にならないように制限
    updateEnemyHPBar();

    // 敵のHPが0になったら敵を倒す
    if (enemyHP <= 0) {
        console.log("Enemy defeated!");
        // 敵をシーンから削除する処理をここに追加
    }
}


// 敵オブジェクトを作成する関数
function createEnemy(position) {
    const geometry = new THREE.BoxGeometry(5, 5, 5); // 大きな立方体の形状
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // 敵の色
    const largeEnemy = new THREE.Mesh(geometry, material);

    // 敵を指定の位置に配置
    largeEnemy.position.set(position.x, position.y, position.z);

    
    // 敵をシーンに追加
    scene.add(largeEnemy);
return largeEnemy;

}



function gameLoop() {
    if (!isPaused) {

        // HP回復のチェック
        checkAndRecoverHP();

        // ジャンプ処理
        if (isJumping) {
            player.position.y += jumpVelocity; // ジャンプ中のy座標を更新
            jumpVelocity -= gravity; // 重力で速度を減少

            // 地面に到達したらジャンプを終了
            if (player.position.y <= 0.25) {
                player.position.y = 0.25; // 地面の高さにリセット
                isJumping = false; // ジャンプ終了
                jumpVelocity = 0; // 速度をリセット
            }
            

        }
        updateBeam(); // ビームを更新
        

        // プレイヤーのバウンディングボックスを設定
        const playerBoundingBox = new THREE.Box3().setFromObject(player);

        obstacles.forEach((obstacle, index) => {
           
            obstacle.position.z += obstacleSpeed; // 障害物の移動
           

            // 障害物のバウンディングボックスを更新
            obstacle.boundingBox.setFromObject(obstacle);

            // プレイヤーと障害物のバウンディングボックスが交差するかを判定
            if (playerBoundingBox.intersectsBox(obstacle.boundingBox)) {
                console.log("障害物に衝突しました！");
                playerHP--;
                updateHPBar(); // HPバーの更新
                
                // HPが0以下ならゲームオーバー
                if (playerHP <= 0) {
                    gameOver(); // ゲームオーバー処理を呼び出し
                }
                scene.remove(obstacle); // 衝突した障害物を削除
                obstacles.splice(index, 1); // 配列からも削除
            }

            // 障害物が画面外に出たら削除
            if (obstacle.position.z > 10) {
                scene.remove(obstacle);
                obstacles.splice(index, 1);
            }
        });

        if (Math.random() < 0.01) createObstacle(); // 障害物の生成確率
    }
         // 無敵時間が経過したかどうかの確認
    const currentTime = Date.now();
    if (isInvincible && (currentTime - lastHitTime) >= 5000) {
        isInvincible = false; // 5秒経過後に無敵状態を解除
    }

  

    renderer.render(scene, camera);
    requestAnimationFrame(gameLoop);

      
}

// ゲームリセット関数
function resetGame() {
    playerHP = 3; // HPをリセット
    updateHPBar(); // HPバーをリセット
    player.position.set(0, 0.25, 7); // プレイヤーの初期位置
    obstacles.forEach(obstacle => scene.remove(obstacle)); // すべての障害物を削除
    obstacles = []; // 障害物リストをクリア
    enemyHP = 100; 
    obstacleSpeed = INITIAL_OBSTACLE_SPEED;
    console.log("Obstacle speed reset to:", obstacleSpeed); // ここで確認
       // 障害物の生成を開始
       createObstacle();
   
}
gameLoop();
