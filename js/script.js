function ParseTimeToSeconds(lineParts) {
    const time = lineParts.split(":");
    const timeValue = +time[0] * 3600 + +time[1] * 60 + +time[2];
    return timeValue;
}

function getFullTime(departTime, arriveTime) {
    return arriveTime - departTime < 0 ?
        arriveTime - departTime + 86400 :
        arriveTime - departTime;
}

function ParseTrains(lines) {
    const trains = [];
    for (line of lines) {
        const lineParts = line.split(";");
        trains.push({
            id: +lineParts[0],
            from: +lineParts[1],
            to: +lineParts[2],
            price: +lineParts[3],
            departTime: lineParts[4],
            arriveTime: lineParts[5],
        });
    }
    return trains;
}

function ParseStations(lines) {
    const stations = new Set();
    for (line of lines) {
        stations.add(line.split(";")[1]);
    }
    return stations;
}

function sumAll(arr) {
    return arr.map(
        (item) => +item.reduce((sum, elem) => sum + elem, 0).toFixed(2)
    );
}


function sumAllTimes(arr) {
    return arr.map((item) => {
        let str = [];
        str.push((Math.trunc(item / 3600).toString()).padStart(2, "0"));
        str.push((Math.round((item % 3600) / 60).toString()).padStart(2, "0"));
        str.push("00");
        return str.join(":");
    });
}

function FindCheapestRoute(trains, stations, numberOfStations) {
    const cheapestRoutePrice = []; // составление маршрута самых дешевых показателей преодоления маршрута
    const route = []; // составление маршрута
    const routeStations = [+stations]; // начало постороение маршрута с новой уникальной станции
    let i = 0;
    while (i < numberOfStations - 1) {
        // работа цикла продолжается до момента связывания всех станций
        for (let n = 0; n < trains.length; n++) {
            // перебор всех массива станций
            if (routeStations[i] === trains[n].from) {
                // если совпадает текущая станция со станцией из массива
                // если элемент массива хранения самых дешевых показателей преодоления маршрута пуст и он уникален
                if (
                    !cheapestRoutePrice[i] &&
                    routeStations.every((element) => element !== trains[n].to)
                ) {
                    cheapestRoutePrice[i] = trains[n].price; // заполняем массив хранения самых дешевых показателей
                    route[i] = trains[n]; // добавляем  маршрут
                    routeStations.push(route[i].to); // добавляем новую станцию
                } else if (
                    cheapestRoutePrice[i] >= trains[n].price &&
                    routeStations.every((element) => element !== trains[n].to)
                ) {
                    cheapestRoutePrice[i] = trains[n].price; // заполняем массив хранения самых дешевых показателей
                    route[i] = trains[n]; // добавляем  маршрут
                    routeStations[i + 1] = route[i].to; // перезаписываем новую станцию
                }
            }
        }
        i++;
    }
    return route.length === numberOfStations - 1 ? route : null; // если маршрут не пройден полностью, то возвращаем null, если пройден - маршрут
}

function FindFastestRoute(trains, stations, numberOfStations) {
    const fastestRouteTime = []; // массив для хранения самых быстрых показателей преодоления маршрута
    const route = []; // составление маршрута
    let i = 0;
    const routeStations = [+stations]; // начало постороение маршрута с новой уникальной станции

    while (i < numberOfStations - 1) {
        // работа цикла продолжается до момента связывания всех станций
        for (let n = 0; n < trains.length; n++) {
            // перебор всех массива станций
            if (routeStations[i] === trains[n].from) {
                // если совпадает текущая станция со станцией из массива

                let fullTime = getFullTime(
                    ParseTimeToSeconds(trains[n].departTime),
                    ParseTimeToSeconds(trains[n].arriveTime)
                ); // полное время в пути между станцией отправления и прибытия

                // если элемент массива хранения самых быстрых показателей преодоления маршрута пуст и он уникален
                if (
                    !fastestRouteTime[i] &&
                    routeStations.every((element) => element !== trains[n].to)
                ) {
                    if (fastestRouteTime[i - 1]) {
                        // если существует предыдущая станция
                        // находим время в пути и время ожидания перед отправкой
                        fastestRouteTime[i] =
                            getFullTime(
                                ParseTimeToSeconds(route[i - 1].arriveTime),
                                ParseTimeToSeconds(trains[n].departTime)
                            ) + fullTime;
                        route[i] = trains[n];
                        routeStations.push(route[i].to);
                    } else {
                        // условие записи для первой станции
                        fastestRouteTime[i] = fullTime;
                        route[i] = trains[n];
                        routeStations.push(route[i].to);
                    }
                } else if (
                    fastestRouteTime[i] >= fullTime &&
                    routeStations.every((element) => element !== trains[n].to)
                ) {
                    if (fastestRouteTime[i - 1]) {
                        // если существует предыдущая станция
                        // находим время в пути и время ожидания перед отправкой
                        let waitingTime =
                            getFullTime(
                                ParseTimeToSeconds(route[i - 1].arriveTime),
                                ParseTimeToSeconds(trains[n].departTime)
                            ) + fullTime;
                        if (fastestRouteTime[i] > waitingTime) {
                            fastestRouteTime[i] = waitingTime;
                            fastestRouteTime[i] = trains[n];
                            routeStations[i + 1] = route[i].to;
                        }
                    } else {
                        // условие записи для первой станции
                        fastestRouteTime[i] = fullTime;
                        route[i] = trains[n];
                        routeStations[i + 1] = route[i].to;
                    }
                }
            }
        }
        i++;
    }
    return route.length === numberOfStations - 1 ? route : null; // если маршрут не пройден полностью, то возвращаем null, если пройден - маршрут
}

const lines = data.split("\n");
const trains = ParseTrains(lines);
const stations = [...ParseStations(lines)];

// создаю массив в котором будут перебираться все станции
let allWayTime = stations.map((item) => {
    return FindFastestRoute(trains, item, stations.length); // вызываю функцию и передаю ей массив всех маршрутов, новую станцию(каждый раз уникальная) и количество всех станций
});
allWayTime = allWayTime.filter((route) => route !== null); // сортировка массива, удаляю маршруты, которые не прошли все станции

const TimeInWay = allWayTime.map((item) =>
    item.map((element) => {
        return getFullTime(
            ParseTimeToSeconds(element.departTime),
            ParseTimeToSeconds(element.arriveTime)
        );
    })
);
const time = sumAllTimes(sumAll(TimeInWay))
console.log(allWayTime);
console.log(sumAllTimes(sumAll(TimeInWay)));

// создаю массив в котором будут перебираться все станции
let allRoutePrice = stations.map((item) => {
    return FindCheapestRoute(trains, item, stations.length); // вызываю функцию и передаю ей массив всех маршрутов, новую станцию(каждый раз уникальная) и количество всех станций
});

allRoutePrice = allRoutePrice.filter((route) => route !== null); // сортировка массива, удаляю маршруты, которые не прошли все станции
const minCostRoute = allRoutePrice.map((item) =>
    item.map((element) => element.price)
);

const cost = sumAll(minCostRoute);
console.log(allRoutePrice);
console.log(sumAll(minCostRoute));

//////////////////////////////////////////////////////////////