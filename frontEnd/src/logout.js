const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    sessionStorage.clear();
    window.location.replace("https://bragspot.herokuapp.com"); //redirect to gate
}

export default logout;