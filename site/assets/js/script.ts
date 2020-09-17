export{}

const MONTHS_TO_NUM = {
    "januari": 0,
    "februari": 1,
    "mars": 2,
    "april": 3,
    "maj": 4,
    "juni": 5,
    "juli": 6,
    "augusti": 7,
    "september": 8,
    "oktober": 9,
    "november": 10,
    "december": 11
}

const validZipcodes = [
    "98138",
    "98139",
    "98140",
    "98142",
];

let timeoutId: number;

/**
 * Checks if input from user is valid zipcode and returns status message.
 */
function checkZipcode()
{
    const blommogram = $(".blommogram");

    // Uses regex to remove all non digits.
    let zip: string = $("#zipcode").val() as string;
    zip = zip.replace(/[^\d]/gi, "");

    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
        blommogram.popover('hide');
        blommogram.popover('disable');
    }, 3000) as any;

    if (validZipcodes.includes(zip)) {
        blommogram.attr("data-content", "Vi skickar blommor inom detta postnummer.");
    } else {
        blommogram.attr("data-content", "Vi skickar inte blommor inom detta postnummer.");
    }

    blommogram.popover('enable');
    blommogram.popover('show');
}


/**
 * Gets closed days from hitta_hit.html.
 * Then sorts them by closest date.
 */
function getClosedDays(date)
{
    const today = date;
    const closedDays = [];
    const closedDaysHTML = document.querySelectorAll(".closed-day");

    for(const closedDayElem of closedDaysHTML){
        const children = closedDayElem.children
        const closedDay = children[0].innerHTML + ": " + children[1].innerHTML
        closedDays.push(closedDay)
    }

    const oneDay=1000*60*60*24;

    const closedDaysDates = closedDays.map(day => {
        const dayArr = day.split(" ");
        const month = MONTHS_TO_NUM[dayArr.pop()];
        const dateDay = parseInt(dayArr.pop(), 10);
        let year = today.getFullYear()

        if(month < today.getMonth()){
            year+=1
        } else if(month === today.getMonth()) {
            if(dateDay < today.getDate()) {
                year+=1
            }
        }

        return {day, date: new Date(year, month, dateDay)};
    });

    const sortedDays = closedDaysDates.map(closedDate => {
        const daysDiff = Math.ceil((closedDate.date.getTime()-today.getTime())/(oneDay))
        return [daysDiff, closedDate.day]
    }).sort((a, b) => (a[0] < b[0]) ? -1 : 1); // Sorts by first column.

    return sortedDays;
}


function updateClosedDays(date) {

    const days = getClosedDays(date);
    $("#closed-days-tbody").html("");
    days.forEach(day => {
        day = day[1].split(":")
        $("#closed-days-tbody").append(`<tr class="closed-day"><td>${day[0]}</td><td>${day[1]}</td></tr>`)
    });
}

function openBanner(date)
{
    const openHours = $(".opening-hour").map((index, el) => {
        return (el.lastChild as HTMLElement).innerText;
    });

    const day = date.getDay();
    const openHoursTd = openHours[day === 0 ? 6 : day-1];
    if (openHoursTd.toLowerCase() === "stängt")
        $("#open-banner").text("Idag har vi stängt");
    else
        $("#open-banner").text("Idag har vi öppet " + openHoursTd);
    $(".open-banner-div").css("display", "block");
}

$(document).ready(() => {
    $(".onlyjs").css("display", 'block');

    const fileNameArr: string[] = window.location.pathname.toLowerCase().split("/");;
    const fileName = fileNameArr[fileNameArr.length-1];

    switch(fileName){
        case "hitta_hit.html":
           updateClosedDays(new Date());
           break;
        case "index.html":
        case "":
            const blommogram = $(".blommogram");
            blommogram.popover();
            blommogram.popover("disable");
            break;
        default:
            break;
    }
    openBanner(new Date());
});
