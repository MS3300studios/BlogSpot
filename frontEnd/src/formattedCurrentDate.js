//const days = ["Monday", "Tuesday", "Wendesday", "Thursday", "Friday", "Saturday", "Sunday"];


// const formattedCurrentDate = (shortmonths) => {
//     var d = new Date();
//     let months = [];
//     shortmonths ? months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"] 
//     : months = ["January","February","March","April","May","June","July","August","September","October","November","December"]  

//     let day = (d.getDay()+1).toString();
//     let month = months[d.getMonth()];
//     let year = d.getFullYear();
//     let ordinal;
//     switch (day) {
//         case day[day.length-1]===1:
//             ordinal = "st";
//             break;
//         case day[day.length-1]===2:
//             ordinal = "nd";
//             break;
//         case day[day.length-1]===3:
//             ordinal = "rd";
//             break;
//         default: ordinal="th";
//             break;
//     }
//     let hourNumber = (d.getHours()).toString();
//     let hours;
//     if(hourNumber.length<2) hours = "0"+hourNumber;
//     else hours = hourNumber;
//     let minuteNumber = (d.getMinutes()).toString();
//     let minutes;
//     if(minuteNumber.length<2) minutes = "0"+minuteNumber;
//     else minutes = minuteNumber;
//     let timeString = hours+":"+minutes+"  "+day+ordinal+" "+month+" "+year;

//     return timeString;
// }



const formattedCurrentDate = (date) => {
    console.log(date)
    if(date === undefined){
        return;
    }
    else{
        const formatted = new Date(date).toLocaleDateString();
        return formatted;
    }

}

export default formattedCurrentDate;