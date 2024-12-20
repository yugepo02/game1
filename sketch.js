
let isPaused = true;
const INITIAL_OBSTACLE_SPEED = 0.3; // 最初の障害物速度


let isInvincible = false; // 無敵状態かどうかを示すフラグ
let remainingTime = 3000;      // 無敵状態の残り時間 (ミリ秒)
const interval = 100;          // チェック間隔 (ミリ秒)

let isGameOver = false;

 // BGMとSEの音量調整
 const bgm = document.getElementById('bgm');
 const drainSE = document.getElementById('drainSE');
 const beamSE = document.getElementById('beamSE');
 const Fanbgm = document.getElementById('FanBGM');

 // ポーズ画面の要素を取得
const pauseScreen = document.getElementById('pauseScreen');

//操作説明画面要素
const lectureScreen = document.getElementById('lectureScreen')
const lectureButton = document.getElementById('lectureButton');
const lectureButtonpause = document.getElementById('lectureButtonpause')
const lectureBack = document.getElementById('lectureBack');
const retryButtonpause = document.getElementById('retryButtonpause');
const startmenyuButton = document.getElementById('startmenyuButton');
const pausestartButton = document.getElementById('pausestartButton')

 document.getElementById('bgmVolume').addEventListener('input', (event) => {
     bgm.volume = event.target.value;
     Fanbgm.volume = event.target.value
 });

 document.getElementById('seVolume').addEventListener('input', (event) => {
     drainSE.volume = event.target.value;
     beamSE.volume = event.target.value;
 });

 // スタートボタンのイベント
 document.getElementById('startButton').addEventListener('click', () => {
    bgm.play();
 
     document.getElementById('startScreen').style.display = 'none';  // スタート画面非表示
 });

 document.getElementById('pausestartButton').addEventListener('click',()=>{
    bgm.pause()
    bgm.currentTime = 0;
    document.getElementById('pauseScreen').style.display ='none';
    document.getElementById('startScreen').style.display = 'flex';
    resetGame(); // ゲームをリセット
 })

 // 
startmenyuButton.addEventListener('click', () => {
    document.getElementById('startmenyuButton').style.display = 'none';  // スタート画面ボタン非表示
    document.getElementById('retryButton').style.display = 'none';  // リトライ非表示
    document.getElementById('startScreen').style.display = 'flex';  // スタート画面表示
});

 //操作ガイドボタンのイベント
 lectureButton.addEventListener('click', () => {
 
    document.getElementById('lectureScreen').style.display = 'flex';  // 説明画面表示
});

lectureButtonpause.addEventListener('click', () => {
 
    document.getElementById('lectureScreen').style.display = 'flex';  // 説明画面表示
});

lectureBack.addEventListener('click', () => {
 
    document.getElementById('lectureScreen').style.display = 'none';  // 説明画面非表示
});

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
let beamSpeed = 1;
let isBeamFiring = false; // ビームが発射されている状態を管理する変数
let isBeamReady = false; // ビームが準備完了しているかを管理する変数
let destroyedObstacles = 0; // 破壊された障害物の数

// 障害物リスト
let obstacles = [];

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
const finish = document.getElementById('gameStatus')

// HPバーの要素
const hpBar = document.getElementById('hpBar');

// リトライボタンの要素
const retryButton = document.getElementById('retryButton');

// スタートボタンのクリックイベント
startButton.addEventListener('click', () => {
    startScreen.style.display = 'none'; // スタート画面を非表示
    startGame(); // ゲームを開始
    document.getElementById('bgm').play();
    
});

// リトライボタンのクリックイベント
retryButton.addEventListener('click', () => {
    Fanbgm.pause();
    Fanbgm.currentTime = 0;
    document.getElementById('bgm').play();

    retryButton.style.display = 'none'; // リトライボタンを非表示
    startmenyuButton.style.display='none';
    resetGame(); // ゲームをリセット
    startGame(); // ゲームを再開
});

retryButtonpause.addEventListener('click',()=>{
    pauseScreen.style.display = "none";
    resetGame(); // ゲームをリセット
    startGame(); // ゲームを再開
})

startmenyuButton.addEventListener('click',()=>{
    Fanbgm.pause();
    Fanbgm.currentTime = 0;
    document.getElementById('startScreen').style.display = 'flex';  // スタート画面非表示
})

// ゲーム開始関数
function startGame() {
     isGameOver = false;
    isPaused = false; // ポーズを解除
    playerHP = 3; // HPを初期化
    enemyHP = 100
    updateHPBar(); // 初期のHPバーを表示
    updateEnemyHPBar()
    document.addEventListener('keydown', handlePlayerInput); // キー入力イベントを追加
    retryButton.style.display = 'none'; // リトライボタンを非表示
    scene.add(largeEnemy); 
}

// ゲームリセット関数
function resetGame() {
    // プレイヤー関連のリセット
    playerHP = 3; // HPをリセット
    enemyHP = 100;
    updateHPBar(); // HPバーを更新
    updateEnemyHPBar(enemyHP)
    player.position.set(-0.9000000000000001, 0.25, 7); // プレイヤーの初期位置
    playerMaterial.color.set(0xffffff); // プレイヤーの色を白に戻す
    player.material.opacity = 1.0;
    isInvincible = false;

    // 吸収関連のリセット
    lastAbsorbedColor = null; // 最後に吸収した色をリセット
    consecutiveAbsorbs = 0;   // 連続吸収カウントをリセット
    isBeamReady = false;      // ビーム準備状態をリセット
    

    // 障害物のリセット
    obstacles.forEach(obstacle => scene.remove(obstacle)); // シーンから削除
    obstacles = []; // 配列を空に
    obstacleSpeed = INITIAL_OBSTACLE_SPEED; // 障害物の速度を初期値にリセット

    // 敵関連のリセット
    enemyHP = 100; // 敵のHPを初期化
    destroyedObstacles = 0; // 破壊された障害物のカウントをリセット

    // その他のリセット
    lastHitTime = Date.now(); // 最後の被弾時間を現在にリセット
    remainingTime = 3000; 

    console.log("ゲームがリセットされました。初期状態に戻ります。");
}

function togglePause() {
    if (isPaused) {
        pauseScreen.style.display = "flex"; // ポーズ画面を表示

     
        // ゲームの動きを止める処理（例：ゲームループの停止など）
    } else {
        pauseScreen.style.display = "none"; // ポーズ画面を非表示
        // ゲームを再開する処理（例：ゲームループの再開など）
    }
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
    document.getElementById('bgm').pause();
    isPaused = true; // ゲームを一時停止
    isGameOver = true; // ゲームオーバーフラグを立てる
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
const playerMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
// 吸収した障害物の色を格納する変数
let absorbedColor = null;
const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.position.set(-0.9000000000000001, 0.25, 7); // プレイヤーを手前に配置
scene.add(player);

// 障害物の生成関数（障害物ごとにバウンディングボックスを設定）
function createObstacle() {
    const obstacleMaterial = new THREE.MeshBasicMaterial({ color: getRandomColor() }); // ランダムな色を設定
    let obstacle;

    // X軸のランダムな位置を設定
    const randomXPositions = [-2.7,-0.9000000000000001,0.8999999999999999,2.7];
    const randomX = randomXPositions[Math.floor(Math.random() * randomXPositions.length)];

    if (Math.random() < 0.5) {
        const obstacleGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
    } else {
        const obstacleGeometry = new THREE.BoxGeometry(0.5, 5, 0.5);
        obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
    }

    // X座標をランダムに、Y座標はそのままにして障害物の生成位置を決定
    obstacle.position.x = randomX; // ランダムなX座標を設定
    obstacle.position.y = 0.25; // Y座標はそのまま
    obstacle.position.z = -5; // 障害物が画面外から現れる位置

    // バウンディングボックスを有効化
    obstacle.geometry.computeBoundingBox();
    obstacle.boundingBox = new THREE.Box3().setFromObject(obstacle);
    
    scene.add(obstacle);
    obstacles.push(obstacle);
}
// 障害物を移動させる関数
function moveObstacles() {
    obstacles.forEach((obstacle) => {
        obstacle.position.z += obstacleSpeed; // Z軸方向に移動
        if (obstacle.position.z > 8) {
            // 障害物が画面外に出た場合、シーンから削除
            scene.remove(obstacle);
        }
    });
    // 画面外に出た障害物を配列から削除
    obstacles = obstacles.filter(obstacle => obstacle.position.z <= 8);
}
// プレイヤーの状態
let isJumping = false;
let jumpVelocity = 0;
const gravity = 0.05; // 重力

// ポーズ機能のキーイベント
function handleKeyDown(e) {
    // ゲームオーバー中はキーイベントを無視
    if (isGameOver) {
        return;
    }

    if (e.key === 'p' || e.key === 'P') {
        isPaused = !isPaused; // ポーズのON/OFFを切り替え
        togglePause();
    }
}
document.addEventListener('keydown', handleKeyDown);

// 被弾した時に呼び出される関数
function takeDamage() {
   
    if (isInvincible) return; // 無敵状態なら何もしない

    if (playerHP > 0) {
         1;
        updateHPBar();       
    }
    if (playerHP <= 0) {
        console.log("ゲームオーバー");
        document.getElementById('bgm').pause();
        gameOver();
    }
}
function activateInvincibility() {
    console.log("無敵状態開始");

      // 無敵状態フラグを立てる
      isInvincible = true;
      player.material.transparent = true; // 透明を有効化
      player.material.opacity = 0.5; // 半透明に設定

      const invincibilityTimer = setInterval(() => {
        if (isPaused) {
            // ポーズ中は何もしない
            return;
        }
        // 残り時間を減らす
        remainingTime -= interval;
    
        if (remainingTime <= 0) {
            // 無敵状態を解除
            console.log("無敵状態解除");
            isInvincible = false;
    
            // 明度を元に戻す（透明度を元に戻す）
            player.material.opacity = 1.0;  // 完全に不透明に戻す
            player.material.transparent = false;  // 透明化を無効化
    
            // タイマーを停止
            clearInterval(invincibilityTimer);
            remainingTime = 3000;
        }
    }, interval);
    } 

    

// 10秒間被弾していないかをチェックする関数
function checkAndRecoverHP() {
    const currentTime = Date.now();
    const timeSinceLastHit = (currentTime - lastHitTime) / 1000; // 秒に変換

    if (isPaused) {
        return; // ポーズ中なら何もしない
    }
    
    // HPが2以下かつ13秒以上被弾していない場合にHPを1回復
    if (!isPaused && playerHP < maxPlayerHP && playerHP <= 2 && timeSinceLastHit >= 13) {
        playerHP += 1;
        updateHPBar(); // HPバーを更新
        lastHitTime = Date.now(); // HP回復後、被弾時間をリセット
    } else if (playerHP >= 3) {
        // HPが3以上の場合、何もしない（else の記述も省略可能）
        return;
    }
    }
    

// プレイヤーの入力処理
function handlePlayerInput(e) {
    if (!isPaused) {
        if (e.key === "ArrowLeft") {
            player.position.x -= laneWidth;
            console.log(player.position);
        }
        if (e.key === "ArrowRight") {
            player.position.x += laneWidth;
            console.log(player.position);
        }
        if (e.key === " " && !isJumping) {
            isJumping = true;
            jumpVelocity = 0.5 ; // ジャンプの初速度
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
document.addEventListener('keyup', (e) => {
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
    obstacles.forEach((obstacle) => {
        const distance = player.position.distanceTo(obstacle.position);
        if (distance < minDistance) {
            minDistance = distance;
            nearestObstacle = obstacle;
        }
    });

    if (nearestObstacle && minDistance < 2) { // 障害物がプレイヤーの近くにある場合
        const obstacleColor = nearestObstacle.material.color.getHexString();
        document.getElementById('drainSE').play();
        // 吸収した色を記録
        if (obstacleColor === lastAbsorbedColor) {
            consecutiveAbsorbs++; // 同じ色が連続して吸収された場合、カウントアップ
        } else {
            consecutiveAbsorbs = 1; // 異なる色が吸収された場合、カウントリセット
        }
        // ビームの準備が整ったか確認
        if (consecutiveAbsorbs >= 2) {
            isBeamReady = true; // ビームの準備完了
            consecutiveAbsorbs = 0; // 連続回数リセット
            //animateAuraEffect(`#${obstacleColor}`); // 色を変更する際のアニメーション（例：色が明るくなる）
            animateAuraEffect(obstacleColor); // アニメーション開始
        }
    
        lastAbsorbedColor = obstacleColor; // 吸収した色を記録

         // プレイヤーの色を吸収した障害物の色に設定
         playerMaterial.color.set(`#${obstacleColor}`); 
        
        // 障害物をシーンから削除
        scene.remove(nearestObstacle);
        obstacles = obstacles.filter(obstacle => obstacle !== nearestObstacle); // 配列から削除
    }
}
function animateAuraEffect(absorbedColor) {

    const originalColor = new THREE.Color(`#${absorbedColor}`); // 吸収した色
    const randomColor = new THREE.Color(Math.random(), Math.random(), Math.random()); // ランダムな色
    const duration = 1; // ランダムな色に変わるまでの時間（秒）
    const returnDuration = 0.5; // 元の色に戻る時間（秒）

    let startTime = performance.now();
    let isReturning = false; // 元の色に戻るフェーズかどうか

    function animate() {

        if (isBeamFiring) {
            playerMaterial.color.set(0xffffff); // ビーム発射時に色を白に戻す
            return; // アニメーションを停止
        }
        
        const currentTime = performance.now();
        let elapsedTime = (currentTime - startTime) / 500; // 経過時間（秒）

        if (!isReturning) {
            if (elapsedTime < duration) {
                // ランダムな色に向かって変化
                let lerpFactor = elapsedTime / duration;
                playerMaterial.color.lerpColors(originalColor, randomColor, lerpFactor);
            } else {
                // ランダムな色に設定して戻るフェーズに移行
                playerMaterial.color.set(randomColor);
                isReturning = true;
                startTime = currentTime; // タイマーをリセット
            }
        } else {
            if (elapsedTime < returnDuration) {
                // 元の色に向かって変化
                let lerpFactor = elapsedTime / returnDuration;
                playerMaterial.color.lerpColors(randomColor, originalColor, lerpFactor);
            } else {
                // 最終的に吸収した色に戻す
                playerMaterial.color.set(originalColor);
            }
        }
        // 次のフレームで再度呼び出す
        if (elapsedTime < duration + returnDuration) {
            requestAnimationFrame(animate);
        }
    }
    animate(); // アニメーション開始
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
        document.getElementById('beamSE').play();
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
                bgm.pause();
                bgm.currentTime = 0;
                Fanbgm.play();

                // ループ部分の設定
                const loopStart = 1.8; // ループの開始秒数
                const loopEnd = 9; // ループの終了秒数
                // フルBGM再生中の処理
                Fanbgm.addEventListener('timeupdate', function loopTransition() {
                    const bufferTime = 15; // バッファ時間（少し早めに切り替える）
                    if (Fanbgm.currentTime >= Fanbgm.duration - bufferTime) {
                        console.log('フルBGM終了直前。指定部分をループ開始します。');
                
                        // ループ部分の開始位置に移動
                        Fanbgm.currentTime = loopStart;
                
                        // 無限ループを有効化
                        Fanbgm.loop = false; // HTML5のデフォルトループは無効にする
                
                        // ループ処理を開始
                        Fanbgm.addEventListener('timeupdate', function loopHandler() {
                            if (Fanbgm.currentTime >= loopEnd) {
                                console.log('ループ範囲を再生しています。');
                                Fanbgm.currentTime = loopStart; // ループ開始位置に戻す
                                Fanbgm.play(); // 再生を続ける
                            }
                        });
                
                        // このイベントリスナーを削除して不要な再実行を防止
                        Fanbgm.removeEventListener('timeupdate', loopTransition);
                
                        // ループ部分の再生開始
                        Fanbgm.play();
                    }
                });
                enemyHpBar.style.display = 'none';
                isPaused = true;
                retryButton.style.display = 'block'; // リトライボタンを表示
                startmenyuButton.style.display = 'block';
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
        // ビーム発射後にプレイヤーの色を白に戻す
      playerMaterial.color.set(0xffffff); // 白にリセット

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
           obstacle.position.z += INITIAL_OBSTACLE_SPEED;
            // 障害物のバウンディングボックスを更新
            obstacle.boundingBox.setFromObject(obstacle);
            // プレイヤーと障害物のバウンディングボックスが交差するかを判定
if (playerBoundingBox.intersectsBox(obstacle.boundingBox)) {
    console.log("障害物に衝突しました！");
    // 無敵状態でない場合にのみHPを減少させる
    if (!isInvincible) {
        console.log("無敵ではありません。被弾処理を実行します。");
        // HPを減らす処理
        playerHP--;
        updateHPBar(); // HPバーの更新  
        activateInvincibility(); // 無敵状態の開始
    } else {
        console.log("無敵状態中、HPは減少しません。");
    }   
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
        if (Math.random() < 0.05) createObstacle(); // 障害物の生成確率
    }
    renderer.render(scene, camera);
    requestAnimationFrame(gameLoop);
}
gameLoop();