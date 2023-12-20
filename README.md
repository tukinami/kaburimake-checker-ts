# 被り負けチェッカーTS

[GitHub Repository](https://github.com/tukinami/kaburimake-checker-ts)

「伺か」のゴーストの情報が被っていないか調べます。

## ゴーストのデータが入ったjsonファイルの追加方法

[被り負けチェッカーTSユーティリティー on TypeScript](https://github.com/tukinami/kaburimake-checker-utils-ts)
で作成したjsonファイルの追加方法です。

1. 作成したjsonファイルを、`static/data/ghostData`に入れます。
2. `src/lib/data.ts`を編集し、作成したjsonファイルの名前を配列`ghostDataJsonList`に書き加えます。

プログラム内部で同一データをフィルターしているので、追加するjsonファイルでのデータ被りは気にしなくても大丈夫です。

## ローカル上で実行する場合

[Node.js(と付属の`npm`)](https://nodejs.org)が必要となります。

まず、このレポジトリをダウンロードして、置きたい場所に展開しておいてください。

レポジトリのダウンロードは、レポジトリトップの`Code`ボタンの中にある`Download ZIP`から行なえると思います。
(他の方法もありますが、割愛します)

展開したディレクトリの場所を、仮に`path/to/kaburimake-checker-ts`とします。

1. コマンドプロンプト、PowerShellなどのシェルで、`path/to/kaburimake-checker-ts`に移動します。
2. `npm install` とし、必要なファイルをインストールします。
3. その後、`npm run dev -- --open`とすると開発者用に設定されたサイトがブラウザで開きます。
   (代わりに`npm run dev`とするとブラウザを開かず実行だけされます)
   終了するには、`q`を入力したあと`Enter`キーを押します。
4. より本番に近い環境で実行したい場合は、`npm run build`とした後、
   `npm run dev`などの代わりに`npm run preview -- --open`や`npm run preview`とします。
   (終了方法は、`dev`のときと同じく、`q`を入力したあと`Enter`キーです)

## ライセンス

<p xmlns:cc="http://creativecommons.org/ns#" xmlns:dct="http://purl.org/dc/terms/"><span property="dct:title">被り負けチェッカーTS</span> by <span property="cc:attributionName">月波 清火</span> is marked with <a href="http://creativecommons.org/publicdomain/zero/1.0?ref=chooser-v1" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">CC0 1.0 Universal<img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/zero.svg?ref=chooser-v1"></a></p>

あなたがこのプロジェクトに直接貢献した場合、同ライセンスの下、あなたの貢献したものがこのプロジェクトの一部としてパブリックドメインになることに同意したものとみなされます。

## 作成者

月波 清火 (tukinami seika)

[GitHub](https://github.com/tukinami)
