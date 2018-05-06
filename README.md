# js-google-spreadsheet

|   | A  | B      | C     |
| - | -- | ------ | ----- |
| 1 | id | name   | value |
| 2 |  1 | apple  | りんご |
| 3 |  2 | banana | バナナ |
| 4 |  3 | cacao  | カカオ |


    let spreadsheet = require('js-google-spreadsheet');

    let gs = new spreadsheet.GoogleSpreadSheet({
        apiKey: 'AIza....',
        sheetId: '1yd....',
    });

    let table = gs.fetchRangedDataTable({
        sheetName: 'シート1',
        cellRange: 'A1:C5',
    });

    console.log(table);

    [ { id: '1', name: 'apple', value: 'りんご' },
      { id: '2', name: 'banana', value: 'バナナ' },
      { id: '3', name: 'cacao', value: 'カカオ' } ]


Google API キーはここから作成

https://console.developers.google.com/apis

対象のスプレッドシートは、「リンクを知っている全員が閲覧可」とする。


## install

    npm install js-google-spreadsheet

