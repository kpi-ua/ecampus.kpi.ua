
// 1
function One()
{
    // Табы
    document.getElementById('OneTab').className = 'SelectedTab';
    document.getElementById('TwoTab').className = 'Tab';
 
    // Страницы
    document.getElementById('One').style.display = 'block';
    document.getElementById('OneTab').className = 'SelectedTab';
    document.getElementById('Two').style.display = 'none';
 
}
// 2
function Two()
{
    // Табы
    document.getElementById('OneTab').className = 'Tab';
    document.getElementById('TwoTab').className = 'SelectedTab';
 
    // Страницы
    document.getElementById('One').style.display = 'none';
    document.getElementById('Two').style.display = 'block';
 
}
