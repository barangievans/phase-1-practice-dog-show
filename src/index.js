document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('dog-form');
    const tableBody = document.getElementById('table-body');

    // Step 1: Fetch and render dogs from server
    fetchAndRenderDogs();

    function fetchAndRenderDogs() {
      fetch('http://localhost:3000/dogs')
        .then(response => response.json())
        .then(dogs => {
          tableBody.innerHTML = ''; // Clear existing table rows
          dogs.forEach(dog => renderDogRow(dog));
        })
        .catch(error => console.error('Error fetching dogs:', error));
    }

    // Helper function to render a single dog row in the table
    function renderDogRow(dog) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${dog.name}</td>
        <td>${dog.breed}</td>
        <td>${dog.sex}</td>
        <td><button class="edit-btn" data-id="${dog.id}">Edit</button></td>
      `;
      tableBody.appendChild(tr);

      // Add event listener to edit button for each dog
      const editButton = tr.querySelector('.edit-btn');
      editButton.addEventListener('click', () => populateFormForEdit(dog));
    }

    // Step 2: Populate form for editing
    function populateFormForEdit(dog) {
      document.getElementById('dog-id').value = dog.id;
      document.getElementById('dog-name').value = dog.name;
      document.getElementById('dog-breed').value = dog.breed;
      document.getElementById('dog-sex').value = dog.sex;
    }

    // Step 3: Handle form submission for updating dog
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      const dogId = document.getElementById('dog-id').value;
      const formData = new FormData(form);
      const updatedDog = {
        name: formData.get('name'),
        breed: formData.get('breed'),
        sex: formData.get('sex')
      };

      fetch(`http://localhost:3000/dogs/${dogId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedDog)
      })
      .then(response => response.json())
      .then(updatedDog => {
        fetchAndRenderDogs(); // Re-fetch and render all dogs after successful update
        form.reset(); // Reset form after submission
      })
      .catch(error => console.error('Error updating dog:', error));
    });
  });