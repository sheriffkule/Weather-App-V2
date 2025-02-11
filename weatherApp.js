const darkLight = document.getElementById('darkLight')
darkLight.addEventListener('click', changeTheme);

const userTheme = localStorage.getItem('theme');

if (userTheme === 'dark') {
    darkLight.click();
}

function changeTheme() {
    document.querySelector('body').classList.toggle('dark');
    if (document.querySelector('body').classList.contains('dark')){
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
}