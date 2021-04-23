let logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.replace('http://localhost:3000/'); //redirect to gate
}

export default logout;