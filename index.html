<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>3D Avoid Game</title>
    <style>
       body { 
        margin: 0; 
        overflow-y: scroll; /* 縦方向のスクロールを有効にする */
    }
        #startScreen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            font-size: 24px;
            flex-direction: column;
            z-index: 10;
        }
        #startButton {
            margin-top: 20px;
            padding: 10px 20px;
            font-size: 20px;
            cursor: pointer;
        }
        /* HPバーのスタイル */
        #hpBarContainer {
            position: absolute;
            top: 10px;
            left: 10px;
            width: 100px;
            height: 20px;
            background-color: rgba(0, 0, 0, 0.5);
          
            border-radius: 5px;
            overflow: hidden;
        }
        #hpBar {
            height: 100%;
            width: 100%; /* 初期は満タン */
            background-color:greenyellow; /* HPバーの色 */
        }

          /* 敵のHPバーのスタイル */
          #enemyHpBarContainer {
            position: absolute;
            top: 10px;
            width: 100px;
            height: 20px;
            background-color: rgba(0, 0, 0, 0.5);
            border-radius: 5px;
            overflow: hidden;
        }
        #enemyHpBar {
            height: 100%;
            width: 200%; /* 初期は満タン */
            background-color: red; /* 敵のHPバーの色 */
            border: 1px solid #000;
        }

        /* リトライボタンのスタイル */
        #retryButton {
            display: none;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 10px 20px;
            font-size: 20px;
            background-color: #333;
            color: white;
            border: none;
            cursor: pointer;
            border-radius: 5px;
        }

         /* 音量スライダーのスタイル */
         .volume-slider {
            position: absolute;
            bottom: 10px;
            left: 10px;
            width: 150px;
        }

         /* ポーズ画面 */
         #pauseScreen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.8);
            display: none;
            justify-content: center;
            align-items: center;
            color: white;
            font-size: 24px;
            flex-direction: column;
            z-index: 10;
        }
        
        /*操作説明画面*/
        #lectureScreen{
           position: absolute; /* スクロールしても画面全体を覆う */
           top: 0;
           left: 0;
           width: 100vw;
           height: auto;
           background-color: rgba(0, 0, 0, 0.8);
           display: none;
           justify-content: center;
           align-items: center;
          color: white;
          font-size: 24px;
          flex-direction: column;
          z-index: 10;    
        }
        /* 操作説明ボタンのスタイル */
        #lectureButton {
            margin-top: 20px;
            padding: 10px 20px;
            font-size: 20px;
            cursor: pointer;
        }
        #lectureButtonpause {
            margin-top: 20px;
            padding: 10px 20px;
            font-size: 20px;
            cursor: pointer;
        }

        /*説明画面を閉じるボタン*/
        #lectureBack{
            margin-top: auto; /* ボタンを画面の一番下に配置 */
            padding: 10px 20px;
            font-size: 20px;
            background-color: #333;
            color: white;
            border: none;
            cursor: pointer;
            border-radius: 5px;
        }
        #retryButtonpause{
          margin-top: 20px;
            padding: 10px 20px;
            font-size: 20px;
            cursor: pointer;

        }
         /* リトライボタンのスタイル */
         #startmenyuButton {
            display: none;
            position: absolute;
            top: 40%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 10px 20px;
            font-size: 20px;
            background-color: #333;
            color: white;
            border: none;
            cursor: pointer;
            border-radius: 5px;
        }

        #pausestartButton{
            margin-top: 20px;
            padding: 10px 20px;
            font-size: 20px;
            cursor: pointer;
        }
        #gameoverscreen{
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.8);
            display: none;
            justify-content: center;
            align-items: center;
            color: white;
            font-size: 24px;
            flex-direction: column;
            z-index: 10;
        }
        #gameoverretryButton{
            margin-top: 20px;
            padding: 10px 20px;
            font-size: 20px;
            cursor: pointer;
        }
        #gameoverstartButton{
            margin-top: 20px;
            padding: 10px 20px;
            font-size: 20px;
            cursor: pointer;
        }
        #difficulty-label {
        position: absolute;
        top: 10px;
        left: 10px;
        font-size: 24px;
        font-weight: bold;
    }


    #difficulty-buttons {
        position: absolute;
        top: 40px; /* '難易度' テキストの下に配置 */
        left: 10px;
     
    }

    #difficulty-buttons button {
        margin: 5px;
        padding: 10px 20px;
        font-size: 16px;
        cursor: pointer;
    }

    #difficulty-buttons button:hover {
        background-color: #ddd;
    }
    </style>
</head>
<body>
    <!-- スタート画面 -->
    <div id="startScreen">
        <div>3D Avoid Game</div>
        <button id="startButton">スタート</button>
        <button id="lectureButton">操作ガイド</button>
        <div id="difficulty-label">難易度</div>
        <div id="difficulty-buttons">
            <button onclick="setDifficulty('easy')">Easy</button>
            <button onclick="setDifficulty('normal')">Normal</button>
            <button onclick="setDifficulty('hard')">Hard</button>
        </div>
        
    </div>

    <!-- HPバー -->
    <div id="hpBarContainer">
        <div id="hpBar"></div>
    </div>
   <!-- 敵のHPバー -->
<!-- 敵のHPバー -->
<div id="enemyHpBarContainer" style="position: absolute; right: 10px; bottom: 500px;">
    <div id="enemyHpBar"></div>
</div>
<div id="gameStatus" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 3em; font-weight: bold; color: white;"></div>
    <!-- リトライボタン -->
    <button id="retryButton">リトライ</button>

    <button id="startmenyuButton">スタート画面に戻る</button>

    <audio id="bgm" loop>
        <source src="./BGM・SE/BGM.mp3" type="audio/mpeg">
        お使いのブラウザはaudioタグに対応していません。
      </audio>
      <audio id="FanBGM">
        <source src="./BGM・SE/Fanfare.mp3" type="audio/mpeg">
        お使いのブラウザはaudioタグに対応していません。
      </audio>

      <audio id="drainSE">
        <source src="./BGM・SE/drain.mp3" type="audio/mpeg">
        お使いのブラウザはaudioタグに対応していません。
      </audio>
      
      <audio id="beamSE">
        <source src="./BGM・SE/beam.mp3" type="audio/mpeg">
        お使いのブラウザはaudioタグに対応していません。
      </audio>
     
    

      <!-- ポーズ画面 -->
      <div id="pauseScreen">
        <div>ポーズ中</div>
      <!-- 音量調整スライダー -->
        <div class="volume-slider">
            <label for="bgmVolume">BGM 音量:</label>
            <input type="range" id="bgmVolume" min="0" max="1" step="0.01" value="1">
        </div>
        <div class="volume-slider" style="left: 180px;">
            <label for="seVolume">SE 音量:</label>
            <input type="range" id="seVolume" min="0" max="1" step="0.01" value="1">
        </div>
        <button id="lectureButtonpause">操作ガイド</button>
        <button id="retryButtonpause">リトライ</button>
        <button id="pausestartButton">スタート画面に戻る</button>
            <p>pキーで解除</p>
   
    </div>
     <!-- 操作説明画面 -->
    <div id="lectureScreen">
        <div>
           <h1> このゲームは奥にいる敵にビームを当ててHPを0にすればクリア
                自分のHPが0になればゲームオーバー
            </h1>
            <br>
            <div style="display: flex; align-items: center; margin-top: 10px;">
                <img src="./img/lectureimage04.png" style="width: auto; height: 100px; margin-right: 10px;">
                <span>←自分のHPバー</span>
            </div>
            <br> 
            <div style="display: flex; align-items: center; margin-top: 10px;">
                <img src="./img/lectureimage05.png" style="width: auto; height: 100px; margin-right: 10px;"> 
                <span>←敵のHPバー</span>
            </div>
            <br>
            <h1>プレイヤーの操作</h1>
            <br>
            ・→←キーで左右移動
            <br>
            ・スペースキーでジャンプ
            <br>
            ・障害物が近くに来たらAキーでキャッチ
            <br>
            　　キャッチに成功すると磁気の色が障害物の色に変化する

            <br>
             ・障害物は全部で四色あり、同じ色の障害物を２回連続でキャッチすると攻撃可能(攻撃が可能になると自機が光る)
            <br>
            ・Aキーで攻撃
            <br>
            ・攻撃は直線上にビームを発射
            <br>
            ・ビームは障害物を最大2個まで破壊可能
            <br>
            　　二個破壊された時点で消失
            <br>
            ・敵に当てると敵のHPを減らす
            <br>
            ・３回障害物にぶつかったらゲームオーバー
            <br>
            しばらく被弾しないでいると回復
            <br>

            <video src="./img/lectureimage03.mp4"controls style="width: 500px; height: auto;"></video>
            <br>
            Pキーでポーズ
            <h1>障害物の種類</h1>
            <br>
          
            <img src="./img/lectureimage 01.png">
            <p>小さい障害物</p>
                <p>ジャンプで避けられる</p>
            <br>
                <img src="./img/lectureimage 02.png">
                <p>大きい障害物<p>
                    <p>ジャンプで避けられない<p>
        <br>

        <br>

        </div>
        <br>
        <button id="lectureBack">閉じる</button>
    </div>
    <!--ゲームオーバー画面-->
    <div id="gameoverscreen">
        <h1>ゲームオーバー</h1>
        <button id="gameoverretryButton">リトライ</button>
        <button id="gameoverstartButton">スタート画面に戻る</button>


    </div>


    <!-- Three.jsのライブラリ -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script src="./sketch.js"></script>
</body>
</html>
