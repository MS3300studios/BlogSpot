module.exports = () => {
    let token;
    let local = localStorage.getItem('token');
    let session = sessionStorage.getItem('token');
    if(local !== null){
        token = local;
    }
    else if(session !== null){
        token = session;
    }
    return token;
}

