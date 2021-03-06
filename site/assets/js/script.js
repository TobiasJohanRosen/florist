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

let timeoutId;

/**
 * Checks if input from user is valid zipcode and returns status message.
 */
function checkZipcode()
{
    let blommogram = $(".blommogram");

    // Uses regex to remove all non digits.
    let zip = $("#zipcode").val().replace(/[^\d]/gi, "");

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
        blommogram.popover('hide');
        blommogram.popover('disable');
    }, 3000);

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
    let today = date;
    let closedDays = [];
    let closedDaysHTML = document.getElementsByClassName("closed-day");
    for(let i = 0; i < closedDaysHTML.length; i++){
        let children = closedDaysHTML[i].children
        let closedDay = children[0].innerHTML + ": " + children[1].innerHTML
        closedDays.push(closedDay)
    }

    let oneDay=1000*60*60*24;

    let closedDaysDates = closedDays.map(day => {
        let dayArr = day.split(" ");
        let month = MONTHS_TO_NUM[dayArr.pop()];
        let date = parseInt(dayArr.pop());
        let year = today.getFullYear()

        if(month < today.getMonth()){
            year+=1
        } else if(month == today.getMonth()) {
            if(date < today.getDate()) {
                year+=1
            }
        }

        return {day: day, date: new Date(year, month, date)};
    });

    let sortedDays = closedDaysDates.map(closedDate => {
        let daysDiff = Math.ceil((closedDate.date.getTime()-today.getTime())/(oneDay))
        return [daysDiff, closedDate.day]
    }).sort((a, b) => (a[0] < b[0]) ? -1 : 1); // Sorts by first column.

    return sortedDays;
}


function updateClosedDays(date) {

    days = getClosedDays(date);
    $("#closed-days-tbody").html("");
    days.forEach(day => {
        day = day[1].split(":")
        $("#closed-days-tbody").append(`<tr class="closed-day"><td>${day[0]}</td><td>${day[1]}</td></tr>`)
    });
}

function getDayIndex(weekDay) {

    switch (weekDay) {
        case 0:     // Sunday
            return 2;
        case 6:     // Saturday
            return 1;
        default:    // Monday-Friday
            return 0;
    }
}

function openBanner(date)
{
    $(".open-banner-div").css("display", "inline");
    let open_hours = $(".opening-hour").map((index, el) => {
        return el.lastChild.innerText;
    });

    let day = getDayIndex(date.getDay());
    let open_hours_td = open_hours[day];

    if (open_hours_td.toLowerCase() == "stängt")
        $("#open-banner").text("Idag har vi stängt");
    else
        $("#open-banner").text("Idag har vi öppet " + open_hours_td);
}

$(document).ready(() => {
    $(".onlyjs").css("display", 'block');

    let fileName = window.location.pathname.toLowerCase();
    fileName = fileName.split("/");
    fileName = fileName[fileName.length-1];

    switch(fileName){
        case "hitta_hit.html":
           updateClosedDays(new Date());
           break;
        case "index.html":
        case "":
            $('.blommogram').popover();
            $('.blommogram').popover("disable");
            break;
        default:
            break;
    }
    openBanner(new Date());
});

/**
 * Listen to scroll to change header opacity class
 */
function checkScroll(){
    var startY = $('.navbar').height() * 2; //The point where the navbar changes in px

    if($(window).scrollTop() > startY){
        $('.navbar').addClass("scrolled");
    }else{
        $('.navbar').removeClass("scrolled");
    }
}

if($('.navbar').length > 0){
    $(window).on("scroll load resize", function(){
        checkScroll();
    });
}