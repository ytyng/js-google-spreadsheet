// require node-fetch
// npm i -g node-fetch
'use strict';

const fetch = require("node-fetch");

class GoogleSpreadSheet {

    /**
     * @param settings Object {
     *
     *   apiKey: APIキー
     *     Google API コンソールから作る
     *     https://console.developers.google.com/apis
     *     Google Sheets API を有効にしておくこと
     *
     *   sheetId: GoogleスプレッドシートのID
     *     スプレッドシートのURL から取得する。
     *     「リンクを知っている全員が閲覧可」とする。
     * }
     */
    constructor(settings) {
        this.settings = settings;
    }

    /**
     * @param options Object
     * @returns {string}
     */
    rangedDataURL(options) {
        if (!options) {
            options = {}
        }
        if (!('sheetName' in options)) {
            options.sheetName = 'シート1';
        }
        if (!('cellRange' in options)) {
            options.cellRange = 'A1:X980';
        }
        let sheetName = encodeURIComponent(options.sheetName);

        return `https://sheets.googleapis.com/v4/spreadsheets/${this.settings.sheetId}/values/${sheetName}!${options.cellRange}?key=${this.settings.apiKey}`;
    }

    /**
     * @param options Object {
     *   sheetName: string 例: シート1,
     *   cellRange: string 例: A1:C5,
     * }
     * @returns {Promise<response>} (fetch API)
     */
    fetchRangedData(options) {
        return fetch(this.rangedDataURL(options));
    }

    /**
     * @param options Object {
     *   sheetName: string シート名,
     *   cellRange: string シート範囲 (省略可)
     * }
     * @returns {Promise<Object>}
     */
    fetchRangedDataJson(options) {
        return this.fetchRangedData(options).then(
            response => response.json());
    }

    /**
     * テーブル形式 (オブジェクトの配列) で取得
     * 一番上のレコードがオブジェクトのキーとなる
     * @param options Object{
     *   sheetName: string シート名,
     *   cellRange: string シート範囲 (省略可),
     *   filterActive: boolean active=1 のみでフィルタするか?
     * }
     * @returns {Promise<Array>}
     */
    fetchRangedDataTable(options) {
        let filterActive = ('filterActive' in options) && options.filterActive;

        return this.fetchRangedDataJson(options).then(data => {
            let keys = null;
            let resultTable = [];
            data.values.forEach(row => {
                if (!keys) {
                    keys = row;
                    return true;
                }
                let resultRow = {};
                for (let ki = 0; ki < keys.length; ki++) {
                    resultRow[keys[ki]] = row[ki];
                }
                if (filterActive) {
                    if (!resultRow.active) {
                        return true;
                    }
                }
                resultTable.push(resultRow);
            });
            return resultTable;
        });
    }

}


module.exports = {
    GoogleSpreadSheet: GoogleSpreadSheet,
};
