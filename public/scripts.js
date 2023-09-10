let guests = {};
let allMembers = [];

let families = [];

window.onload = function() {
    fetch('/guests')
    .then(response => response.json())
    .then(data => {
        families = data.families;
        allMembers = [].concat(...families.map(family => family.members));
        initSearch();
        console.log(allMembers)
    });
};

function initSearch() {
    document.getElementById('guestSearch').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const dropdown = document.getElementById('dropdown');
        dropdown.innerHTML = ''; 
        const filteredMembers = allMembers.filter(member => member.toLowerCase().includes(searchTerm));
        filteredMembers.forEach(member => {
            const option = document.createElement('option');
            option.value = member;
            option.className = 'rsvp-dropdown-option';
            dropdown.appendChild(option);
        });
    });

    document.getElementById('guestSearch').addEventListener('change', function() {
        const selectedMember = this.value;
        const family = families.find(fam => fam.members.includes(selectedMember));
    
        if (family) {
            document.getElementById('familyRSVP').style.display = 'block';
            updateFamilyMembersRSVP(family);
        } else {
            document.getElementById('familyRSVP').style.display = 'none';
        }
    });
}

function updateFamilyMembersRSVP(family) {
    const familyDiv = document.getElementById('familyRSVP');
    familyDiv.innerHTML = ''; 

    family.members.forEach(member => {
        const div = document.createElement('div');
        div.className = 'family-member-rsvp';

        const nameLabel = document.createElement('label');
        nameLabel.textContent = member;
        nameLabel.style = 'width: 100%; text-align:center;'
        div.appendChild(nameLabel);

        const attendingDiv = document.createElement('div');
        const attendingLabel = document.createElement('label');
        attendingLabel.textContent = "Attending?";
        const attendingCheckbox = document.createElement('input');
        attendingCheckbox.type = 'checkbox';
        attendingCheckbox.id = `${member}-attending`;
        attendingLabel.appendChild(attendingCheckbox);
        attendingDiv.appendChild(attendingLabel);
        div.appendChild(attendingDiv);

        const dietaryDiv = document.createElement('div');
        dietaryDiv.className = 'dietary-options';
        const dietaryOptions = ["Indian Vegetarian", "halal", "No Restrictions"];
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

    const displayedGuest = document.getElementById('guestSearch').value;
    const family = families.find(fam => fam.members.includes(displayedGuest));
    const members = family ? family.members : [];

    members.forEach(member => {

        const checkbox = document.getElementById(`${member}-attending`);
        if (checkbox) {
            const isAttending = checkbox.checked;

            const radios = document.querySelectorAll(`input[name="${member}-diet"]:checked`);
            if (radios.length > 0) {
                const dietaryPreference = radios[0].value;
                rsvpData[member] = {
                    name: member,
                    isAttending: isAttending,
                    dietaryPreference: dietaryPreference
                };
            } else {
                rsvpData[member] = {
                    
                    isAttending: false,
                    dietaryPreference: "None"
                };
            }
        }
    });

    return rsvpData;
}

function submitRSVP() {
    const rsvpData = gatherRSVPData();
    
    fetch('/rsvp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(rsvpData)
    })

    .then(response => response.json())
    .then(data => {
        alert(data.message);
    });
}
