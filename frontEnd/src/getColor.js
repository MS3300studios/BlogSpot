//defaults to blue

module.exports = () => {
    let color = localStorage.getItem('colorScheme');
    if(color === null){
        localStorage.setItem("colorScheme","blue");
        color = "blue";
    }
    return color;
}

