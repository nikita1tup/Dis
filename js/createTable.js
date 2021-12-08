function createTHead(thead) {
    thead.innerHTML = '';
    let row_1 = document.createElement('tr');

    let heading_1 = document.createElement('th');
    heading_1.innerHTML = "№ вагона";

    let heading_2 = document.createElement('th');
    heading_2.innerHTML = "Откуда";

    let heading_3 = document.createElement('th');
    heading_3.innerHTML = "Куда";

    let heading_4 = document.createElement('th');
    heading_4.innerHTML = "Цена";

    let heading_5 = document.createElement('th');
    heading_5.innerHTML = "Время отправления";

    let heading_6 = document.createElement('th');
    heading_6.innerHTML = "Время прибытия";

    row_1.appendChild(heading_1);
    row_1.appendChild(heading_2);
    row_1.appendChild(heading_3);
    row_1.appendChild(heading_4);
    row_1.appendChild(heading_5);
    row_1.appendChild(heading_6);
    thead.appendChild(row_1);
}

function createTBody(way, tbody) {

    let row = [];
    let heading = [];
    tbody.innerHTML = '';
    for (let i = 0; i < way.length; i++) {
        let n = 0;
        row[i] = document.createElement('tr');

        heading[n] = document.createElement('th');
        heading[n].innerHTML = `${way[i].id}`;

        heading[n + 1] = document.createElement('th');
        heading[n + 1].innerHTML = `${way[i].from}`;

        heading[n + 2] = document.createElement('th');
        heading[n + 2].innerHTML = `${way[i].to}`;

        heading[n + 3] = document.createElement('th');
        heading[n + 3].innerHTML = `${way[i].price}`;

        heading[n + 4] = document.createElement('th');
        heading[n + 4].innerHTML = `${way[i].departTime}`;

        heading[n + 5] = document.createElement('th');
        heading[n + 5].innerHTML = `${way[i].arriveTime}`;


        row[i].appendChild(heading[n]);
        row[i].appendChild(heading[n + 1]);
        row[i].appendChild(heading[n + 2]);
        row[i].appendChild(heading[n + 3]);
        row[i].appendChild(heading[n + 4]);
        row[i].appendChild(heading[n + 5]);
        tbody.appendChild(row[i]);
    }

}

function createTable(obj, lengthObj, key, calculations, description) {
    document.getElementById('wrapper').innerHTML = '';
    for (let j = 0; j < lengthObj; j++) {

        table[j] = document.createElement('table');
        thead[j] = document.createElement('thead');
        tbody[j] = document.createElement('tbody');

        table[j].appendChild(thead[j]);
        table[j].appendChild(tbody[j]);

        createTHead(thead[j]);
        
        if (key === "default") {
            createTBody(obj, tbody[j]);
        } else {
            textDiv[j] = document.createElement('div');
            textDiv[j].innerHTML = `${description} ${calculations[j]}`;
            document.getElementById('wrapper').appendChild(textDiv[j]);
            createTBody(obj[j], tbody[j]);
        }
        document.getElementById('wrapper').appendChild(table[j]);
        
    }
}

function OnSelectionChange(selectionValue) {

    if (selectionValue === 'default') {

        document.getElementById('wrapper').innerHTML = '';
        createTable(trains, 1, "default", ' ', ' ' );
    } else if (selectionValue === 'fast') {

        document.getElementById('wrapper').innerHTML = '';
        createTable([...allWayTime], allWayTime.length,'fast', time,  'Время преодоления маршрута составляет: ');
    } else if (selectionValue === 'cheap') {

        document.getElementById('wrapper').innerHTML = '';
        createTable([...allRoutePrice], allRoutePrice.length, 'cheap', cost, 'Общая цена преодоления маршрута составляет: ');
    }

    console.log(selectionValue);
}

const table = [];
const thead = [];
const tbody = [];
const textDiv = [];

createTable(trains, 1, "default", ' ', ' ');