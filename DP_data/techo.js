// 今日の日付を取得
var today = new Date();
var currentMonth = today.getMonth();
var currentYear = today.getFullYear();

// Display calendar
displayCalendar(currentMonth, currentYear);
displayWeeklyInput(today);

function displayCalendar(month, year) {
    console.log("displayCalendar");
    var calendar = document.getElementById('calendar');
    calendar.innerHTML = '';
    
    // Create a new date object for the given month and year
    var startDate = new Date(year, month, 1);
    var endDate = new Date(year, month + 5, 0); // 5 months ahead
    
    var table = document.createElement('table');
    var header = table.createTHead();
    
    // Create header row for month and year
    var monthHeaderRow = header.insertRow();
    var monthHeaderCell = monthHeaderRow.insertCell();
    monthHeaderCell.setAttribute('colspan', '7');
    monthHeaderCell.classList.add('month-header');
    monthHeaderCell.textContent = startDate.getFullYear() + ' ' + getMonthName(startDate.getMonth());
    
    var row = header.insertRow();
    var weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    
    // Create header cells for weekdays
    for (var i = 0; i < 7; i++) {
        var cell = row.insertCell();
        cell.textContent = weekdays[i];
        if (i === 0) {
            cell.classList.add('sunday'); // 日曜日を赤色にする
        } else if (i === 6) {
            cell.classList.add('saturday'); // 土曜日を青色にする
        }
    }
    
    // Find the index of the first day of the week
    var firstDayIndex = startDate.getDay();
    
    // Create calendar cells
    row = table.insertRow();
    for (var i = 0; i < firstDayIndex; i++) {
        var cell = row.insertCell();
    }
    var currentDate = startDate;
    while (currentDate <= endDate) {
        if (currentDate.getDay() === 0 && currentDate.getDate() !== 1) {
            row = table.insertRow();
        }
        var cell = row.insertCell();
        cell.textContent = (currentDate.getMonth() + 1) + '/' + currentDate.getDate() ;
        cell.setAttribute('data-date', currentDate.toDateString());
        cell.onclick = function() {
            showInputPanel(this.getAttribute('data-date'));
        };
        // Highlight today's date
        if (currentDate.toDateString() === today.toDateString()) {
            cell.classList.add('today-date');
        }
        // Check if there's any saved input for this date
        var savedInput = loadSavedInput(currentDate.toDateString());
        if (savedInput) {
            cell.classList.add('filled-date');
        }
        // Apply style for past dates
        if (currentDate < today ) {
            cell.classList.add('past-date');
        }
        currentDate.setDate(currentDate.getDate() + 1);
        
        // Add a new row when it's Sunday to avoid overlapping of dates
        if (currentDate.getDay() === 0 && currentDate <= endDate) {
            row = table.insertRow();
        }
    }
    
    calendar.appendChild(table);
}

function showInputPanel(dateString) {
    console.log("shoeInputPanel");
    document.getElementById('selectedDate').textContent = dateString;
    document.getElementById('inputPanel').style.display = 'block';
    // Load saved input for this date
    var savedInput = loadSavedInput(dateString);
    document.getElementById('inputText').value = savedInput || '';
}

function saveInput() {
    console.log("saveInput");
    var selectedDate = document.getElementById('selectedDate').textContent;
    var inputText = document.getElementById('inputText').value;
    // Save input for this date
    saveInputToStorage(selectedDate, inputText);
    // Hide input panel
    document.getElementById('inputPanel').style.display = 'none';
    // Refresh calendar to update filled dates
    var month = new Date(selectedDate).getMonth();
    var year = new Date(selectedDate).getFullYear();
    displayCalendar(month, year);
    displayWeeklyInput(today);
}

function clearInput() {
    console.log("clearInput");
    document.getElementById('inputText').value = ''; // Clear input field
    saveInput();
}

function loadSavedInput(dateString) {
    console.log("loadSavedInput");
    // Implement loading saved input from storage
    // For example, using localStorage
    console.log(dateString);
    return localStorage.getItem(dateString);
}

function saveInputToStorage(dateString, inputText) {
    console.log("saveInputToStotage");
    // Implement saving input to storage
    // For example, using localStorage
    localStorage.setItem(dateString, inputText);
}

// Remove saved input for dates 5 months ago
function removeOldInput() {
    console.log("removOldInput");
    var fiveMonthsAgo = new Date(today);
    fiveMonthsAgo.setMonth(fiveMonthsAgo.getMonth() - 5);
    var dateKeys = Object.keys(localStorage);
    dateKeys.forEach(function(key) {
        var date = new Date(key);
        if (date < fiveMonthsAgo) {
            localStorage.removeItem(key);
        }
    });
}

// Call removeOldInput when the page loads
removeOldInput();

function getMonthName(monthIndex) {
    console.log("getMonthName");
    var monthNames = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    return monthNames[monthIndex];
}

function displayWeeklyInput(startDate) {
    console.log("displayWeeklyInput");
    var endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 13); // 一週間後から2週間後まで
    var weeklyInputContainer = document.getElementById('weeklyInput');
    weeklyInputContainer.innerHTML = '<h2>Weekly Input</h2>';
    var inputList = document.createElement('ul');
    for (var d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        var savedInput = loadSavedInput(d.toDateString());
        if (savedInput) {
            var listItem = document.createElement('li');
            listItem.textContent = d.toDateString() + ': ' + savedInput;
            inputList.appendChild(listItem);
        }
    }
    weeklyInputContainer.appendChild(inputList);
}

function formatDateCustom(date) {
    var year = date.getFullYear();
    var month = ('0' + (date.getMonth() + 1)).slice(-2); // 月は0ベースなので+1し、2桁表示
    var day = ('0' + date.getDate()).slice(-2); // 2桁表示
    var weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    var weekday = weekdays[date.getDay()];
    
    return year + '年' + month + '月' + day + '日' + '（' + weekday + '）';
}