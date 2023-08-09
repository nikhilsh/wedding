const families = {
    "Doe Family": {
        members: ["John Doe", "Jane Doe", "Sam Doe"],
        hasResponded: false,
        attendingMembers: [],
        dietaryPreferences: {}
    },
    // ... add more families as needed
};

const allMembers = [].concat(...Object.values(families).map(family => family.members));

document.getElementById('guestSearch').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const dropdown = document.getElementById('dropdown');

    // Clear previous options
    dropdown.innerHTML = '';

    const filteredMembers = allMembers.filter(member => member.toLowerCase().includes(searchTerm));

    filteredMembers.forEach(member => {
        const option = document.createElement('option');
        option.value = member;
        dropdown.appendChild(option);
    });
});

document.getElementById('guestSearch').addEventListener('change', function() {
    const family = findFamilyByMember(this.value);
    if (family) {
        document.getElementById('familyRSVP').style.display = 'block';
        updateFamilyMembersRSVP(family);
    } else {
        document.getElementById('familyRSVP').style.display = 'none';
    }
});

function findFamilyByMember(memberName) {
    return Object.values(families).find(family => family.members.includes(memberName));
}

function updateFamilyMembersRSVP(family) {
    const familyDiv = document.getElementById('familyRSVP');
    familyDiv.innerHTML = ''; // Reset

    family.members.forEach(member => {
        const div = document.createElement('div');
        div.className = 'family-member-rsvp';

        const nameLabel = document.createElement('label');
        nameLabel.textContent = member;
        div.appendChild(nameLabel);

        const dietaryDiv = document.createElement('div');
        dietaryDiv.className = 'dietary-options';
        const dietaryOptions = ["veg", "halal", "none"];
        dietaryOptions.forEach(option => {
            const label = document.createElement('label');
            label.textContent = option.charAt(0).toUpperCase() + option.slice(1);

            const input = document.createElement('input');
            input.type = 'radio';
            input.name = `${member}-diet`;
            input.value = option;
            if (option === "none") {
                input.checked = true;
            }

            label.insertBefore(input, label.firstChild);
            dietaryDiv.appendChild(label);
        });

        div.appendChild(dietaryDiv);
        familyDiv.appendChild(div);
    });
}

function gatherRSVPData() {
    const rsvpData = {};

    Object.values(families).forEach(family => {
        family.members.forEach(member => {
            const radios = document.querySelectorAll(`input[name="${member}-diet"]:checked`);
            if (radios.length > 0) {
                const dietaryPreference = radios[0].value;
                rsvpData[member] = {
                    isAttending: true,
                    dietaryPreference: dietaryPreference
                };
            } else {
                rsvpData[member] = {
                    isAttending: false,
                    dietaryPreference: "None"
                };
            }
        });
    });

    return rsvpData;
}

function submitRSVP() {
    const rsvpData = gatherRSVPData();
    alert(JSON.stringify(rsvpData, null, 4));
}

function showTab(tabName) {
    const allTabContents = document.querySelectorAll('.tab-content');
    allTabContents.forEach(content => {
        content.style.display = 'none';
    });

    const tabContent = document.getElementById(tabName);
    tabContent.style.display = 'block';
}

// Initialize by showing the first tab
showTab('home');
