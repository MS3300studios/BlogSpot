let getUserData = () => {
    let userData;
    let local = localStorage.getItem('userData');
    let session = sessionStorage.getItem('userData');
    if(local !== null){
        userData = JSON.parse(local);
    }
    else if(session !== null){
        userData = JSON.parse(session);
    }
    return userData;
}

export default getUserData;