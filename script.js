let names = [
    'Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack',
    'Kate', 'Liam', 'Mia', 'Noah', 'Olivia', 'Paul', 'Quinn', 'Ryan', 'Sophia', 'Thomas',
    'Uma', 'Victor', 'Wendy', 'Xander', 'Yara', 'Zack', 'Anna', 'Ben', 'Chloe', 'Dan'
];
let selectedNames = [];
let winner = null;

function displayNameList() {
    const nameList = document.getElementById('nameList');
    nameList.innerHTML = '';
    
    for (let i = 0; i < names.length; i += 10) {
        const column = document.createElement('div');
        column.className = 'name-column';
        
        for (let j = i; j < i + 10 && j < names.length; j++) {
            const name = names[j];
            const label = document.createElement('label');
            label.className = 'name-checkbox';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = name;
            checkbox.checked = true; // Default to checked
            checkbox.addEventListener('change', updateSelectedNames);
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(name));
            column.appendChild(label);
        }
        
        nameList.appendChild(column);
    }
    
    updateSelectedNames(); // Initialize selectedNames with all names
}

function toggleAllNames() {
    const isChecked = document.getElementById('selectAll').checked;
    document.querySelectorAll('#nameList input[type="checkbox"]:not(#selectAll)').forEach(checkbox => {
        checkbox.checked = isChecked;
    });
    updateSelectedNames();
}

function updateSelectedNames() {
    selectedNames = Array.from(document.querySelectorAll('#nameList input:checked:not(#selectAll)')).map(cb => cb.value);
    displayFireworks();
    
    // Update "Select All" checkbox state
    const selectAllCheckbox = document.getElementById('selectAll');
    selectAllCheckbox.checked = selectedNames.length === names.length;
}

function createFirework(x, y, name, isWinner) {
    const firework = document.createElement('div');
    firework.className = 'firework';
    firework.style.left = `${x}px`;
    firework.style.bottom = `${y}px`;
    
    const baseHeight = (window.innerHeight - y) / 2;
    const launchHeight = isWinner ? baseHeight * 1.1 : baseHeight;
    firework.style.setProperty('--launch-height', `${launchHeight}px`);
    
    const trail = document.createElement('div');
    trail.className = 'trail';
    firework.appendChild(trail);
    
    const rocketImage = document.createElement('img');
    rocketImage.src = 'firework.png';
    rocketImage.alt = name;
    rocketImage.className = 'rocket-image';
    firework.appendChild(rocketImage);
    
    const bang = document.createElement('div');
    bang.className = 'bang';
    if (isWinner) {
        bang.classList.add('winner-bang');
        bang.style.backgroundImage = "url('winner-bang.png')";
        bang.style.top = '-40px'; // Slightly higher for the winner
    } else {
        bang.style.backgroundImage = "url('bang.png')";
    }
    
    const nameSpan = document.createElement('span');
    nameSpan.className = 'bang-name';
    nameSpan.textContent = name;
    bang.appendChild(nameSpan);
    
    firework.appendChild(bang);
    
    setTimeout(() => {
        trail.style.display = 'none';
    }, 1000);

    setTimeout(() => firework.remove(), 7000);
    
    document.getElementById('fireworkArea').appendChild(firework);

    if (isWinner) {
        setTimeout(() => {
            showWinnerPopup(name);
        }, 1500);
    }
}

function showWinnerPopup(name) {
    const popup = document.getElementById('winnerPopup');
    const winnerBang = document.getElementById('winnerBang');
    const winnerName = document.getElementById('winnerName');
    const removeWinnerButton = document.getElementById('removeWinnerButton');
    const closePopupButton = document.getElementById('closePopupButton');

    winnerBang.src = 'winner-bang.png';
    winnerName.textContent = name;
    popup.style.display = 'block';

    removeWinnerButton.onclick = function() {
        uncheckWinner(name);
        popup.style.display = 'none';
    };

    closePopupButton.onclick = function() {
        popup.style.display = 'none';
    };

    // Remove the automatic closing setTimeout
}

function uncheckWinner(name) {
    const checkbox = document.querySelector(`#nameList input[value="${name}"]`);
    if (checkbox) {
        checkbox.checked = false;
        updateSelectedNames();
    }
}

function launchFireworks() {
    selectedNames.forEach(name => {
        const fireworkElement = document.querySelector(`.firework-image[data-name="${name}"]`);
        fireworkElement.style.visibility = 'hidden'; // Hide the initial firework
        const rect = fireworkElement.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = window.innerHeight - rect.top - rect.height / 2;
        const isWinner = name === winner;
        
        createFirework(x, y, name, isWinner);
    });
}

function displayFireworks() {
    const fireworkList = document.getElementById('fireworkList');
    fireworkList.innerHTML = '';
    selectedNames.forEach((name, index) => {
        if (index % 10 === 0) {
            const row = document.createElement('div');
            row.className = 'firework-row';
            fireworkList.appendChild(row);
        }
        const fireworkImage = document.createElement('img');
        fireworkImage.src = 'firework.png'; // Replace with your actual image URL
        fireworkImage.alt = name;
        fireworkImage.className = 'firework-image';
        fireworkImage.dataset.name = name;
        fireworkList.lastChild.appendChild(fireworkImage);
    });
}

function pickWinnerAndLaunch() {
    if (selectedNames.length === 0) {
        alert('Please select at least one name.');
        return;
    }
    winner = selectedNames[Math.floor(Math.random() * selectedNames.length)];
    launchFireworks();
}

window.onload = function() {
    displayNameList();
    displayFireworks();
    const launchButton = document.getElementById('launchButton');
    launchButton.addEventListener('click', pickWinnerAndLaunch);
    const selectAllCheckbox = document.getElementById('selectAll');
    selectAllCheckbox.addEventListener('change', toggleAllNames);
};