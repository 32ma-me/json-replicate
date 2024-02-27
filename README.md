# json-replicate
works with [Cloudflare Workers®](https://workers.cloudflare.com/)

## 何
Cloudflare Workers KV に任意のjsonを保存して、爆速で取り出せるAPIです。  
難しいことをしていないので、ググれば似たようなものは作れると思います。

## いるもの
- [Cloudflare](https://cloudflare.com) アカウント
- Node.js 16.17.0 以降(wranglerの動作に必要)

## セットアップ
### 0. このリポジトリをclone
```shell
$ git clone https://github.com/32ma-me/json-replicate.git
$ cd json-replicate
$ sudo corepack enable yarn
```
### 1. 必須パッケージをインストール
```shell
$ yarn
```
### 2. 新規KV Namespaceを作成
```shell
$ yarn wrangler kv:namespace create STORE_KV
```
こんな出力が出ると思います
```
✨ Success!
Add the following to your configuration file in your kv_namespaces array:
{ binding = "STORE_KV", id = "0123456789abcdef0123456789abcdef" }
```
### 3. 先程の出力を `wrangler.toml` にコピペ
ここを
```toml
# Bind a KV Namespace. Use KV as persistent storage for small key-value pairs.
# Docs: https://developers.cloudflare.com/workers/runtime-apis/kv
# [[kv_namespaces]]
# binding = "STORE_KV"
# id = "enter your id"
```
こう
```toml
# Bind a KV Namespace. Use KV as persistent storage for small key-value pairs.
# Docs: https://developers.cloudflare.com/workers/runtime-apis/kv
[[kv_namespaces]]
binding = "STORE_KV"
id = "0123456789abcdef0123456789abcdef"
```
これでスクリプトがKVを認識できるようになります。やった〜
### 4. デプロイ
```shell
$ yarn wrangler deploy
```
`https://json-replicate.[設定したhostname].workers.dev` にデプロイされるはずです。されなかったら呼んでください。

## 使い方
`/` および任意のパスで HTTP リクエストを受け付けます。
### POST リクエスト(データの書き込み)
以下のようなjsonを送りつけてやると、データが書き込まれます。
```json
"data_1":{
    "hoge":"fuga"
}
```
また、複数送っても対応できます。
```json
"data_1":{
    "hoge":"fuga"
},
"data_2":{
    "lorem":"ipsum"
}
```
正常にいった場合、`200 OK` が帰ってきます。  
キーが空だったりすると、`500 Internal Server Error` とともに Cloudflare 特有の *あの画面* が帰ってきます。
### GET リクエスト(データの読み込み)
パラメータとして `?key="[書き込んだjsonのキー]"`を与えてやると、書き込んだjsonを取り出すことができます。  
先程の例なら、`?key="data_1"` としてやると `{"hoge":"fuga"}` が帰ってきます。  
キーが空だったり存在しなかったりすると `404 Not Found` が帰ってきます。

## ライセンス
Unlicenseです。好きに使ってください。裁判沙汰になったらがんばります。