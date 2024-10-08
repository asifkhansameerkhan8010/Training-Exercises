document.addEventListener('DOMContentLoaded', function () {
    const categoryListBody = document.getElementById('category-list-body');
    const addCategoryForm = document.getElementById('add-category-form');
    const categoryError = document.getElementById('category-error');
    let editingCategoryIndex = null; // Track the category being edited

    // Function to retrieve categories from local storage
    function getCategories() {
        const categories = localStorage.getItem('categories_list');
        return categories ? JSON.parse(categories) : [];
    }

    // Function to save categories back to local storage
    function saveCategories(categories) {
        localStorage.setItem('categories_list', JSON.stringify(categories));
    }

    // Function to display categories in the admin panel
    function displayCategories() {
        const categories = getCategories();
        categoryListBody.innerHTML = ''; // Clear existing category list

        categories.forEach((category, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${category.name}</td>
                <td>
                    <button class="edit-button" data-index="${index}">Edit</button>
                    <button class="delete-button" data-index="${index}">Delete</button>
                </td>
            `;
            categoryListBody.appendChild(row); // Append category row to the table body
        });
    }

    // Display categories when the page loads
    displayCategories();

    // Handle Edit and Delete actions
    categoryListBody.addEventListener('click', function (event) {
        const button = event.target;
        const index = button.getAttribute('data-index');

        if (button.classList.contains('edit-button')) {
            // Handle edit action
            const categories = getCategories();
            const category = categories[index];
            if (category) {
                document.getElementById('category-name').value = category.name; // Set form input to category name
                editingCategoryIndex = index; // Set the index of the category being edited
            }
        } else if (button.classList.contains('delete-button')) {
            // Handle delete action
            if (confirm('Are you sure you want to delete this category?')) {
                const categories = getCategories();
                categories.splice(index, 1); // Remove the category from the array
                saveCategories(categories); // Save the updated categories array
                displayCategories(); // Refresh the category list
                updateEventCategoryDropdown(); // Update the dropdown on the user side
            }
        }
    });

    // Handle form submission for adding or updating categories
    addCategoryForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const categoryName = document.getElementById('category-name').value.trim();
        if (!categoryName) {
            categoryError.textContent = 'Category name cannot be empty!';
            return;
        }

        const categories = getCategories();

        // Check for duplicate category names
        const duplicateCategory = categories.find((category, index) => category.name.toLowerCase() === categoryName.toLowerCase() && index !== editingCategoryIndex);
        if (duplicateCategory) {
            categoryError.textContent = 'Category name already exists!';
            return;
        }

        if (editingCategoryIndex !== null) {
            // Update existing category
            categories[editingCategoryIndex].name = categoryName;
            editingCategoryIndex = null; // Reset editing index
        } else {
            // Add new category
            categories.push({ name: categoryName });
        }

        saveCategories(categories); // Save categories to local storage
        categoryError.textContent = ''; // Clear any error messages
        addCategoryForm.reset(); // Reset the form
        displayCategories(); // Refresh the category list
        updateEventCategoryDropdown(); // Update the dropdown on the user side
    });

    // Function to update the event category dropdown on the user side
    function updateEventCategoryDropdown() {
        const eventCategorySelect = document.getElementById('event-category');
        if (!eventCategorySelect) return; // Check if dropdown exists

        eventCategorySelect.innerHTML = ''; // Clear existing options

        const categories = getCategories(); // Get the updated categories list
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.name.toLowerCase();
            option.textContent = category.name;
            eventCategorySelect.appendChild(option); // Add category as an option to the dropdown
        });
    }

    // Initialize event categories on page load
    updateEventCategoryDropdown();
});
