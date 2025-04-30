const sampleResources = [
    {
        id: 1,
        name: "Community Food Bank",
        type: "food",
        address: "123 Main St, City",
        phone: "(555) 123-4567",
        hours: "Mon-Fri: 9AM-5PM",
        rating: 4.5,
        lat: 37.7749,
        lng: -122.4194,
        reviews: [
            { user: "John D.", rating: 5, comment: "Very helpful staff and well organized." },
            { user: "Sarah M.", rating: 4, comment: "Great resource for the community." }
        ]
    },
    {
        id: 2,
        name: "Hope Shelter",
        type: "shelter",
        address: "456 Oak Ave, City",
        phone: "(555) 234-5678",
        hours: "24/7",
        rating: 4.8,
        lat: 37.7790,
        lng: -122.4290,
        reviews: [
            { user: "Mike R.", rating: 5, comment: "Safe and clean facility." }
        ]
    },
    {
        id: 3,
        name: "Community Health Clinic",
        type: "clinic",
        address: "789 Pine St, City",
        phone: "(555) 345-6789",
        hours: "Mon-Sat: 8AM-6PM",
        rating: 4.2,
        lat: 37.7680,
        lng: -122.4140,
        reviews: [
            { user: "Lisa K.", rating: 4, comment: "Professional and caring staff." }
        ]
    }
];

// DOM Elements
const locationBtn = document.getElementById('locationBtn');
const searchInput = document.getElementById('searchInput');
const resourceType = document.getElementById('resourceType');
const resourcesList = document.getElementById('resourcesList');
const modal = document.getElementById('resourceModal');
const modalContent = document.getElementById('modalContent');
const closeModal = document.querySelector('.close');

// Google Map
let map;
let markers = [];
let userLocation = null;

// Initialize map
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 13,
        center: { lat: 37.7749, lng: -122.4194 } // default center
    });

    displayResources(sampleResources);
}

// Display resources
function displayResources(resources) {
    resourcesList.innerHTML = '';
    clearMarkers();

    resources.forEach(resource => {
        const card = document.createElement('div');
        card.className = 'resource-card';
        card.innerHTML = `
            <h3>${resource.name}</h3>
            <p>${resource.address}</p>
            <p>${resource.hours}</p>
            <div class="rating">
                ${'★'.repeat(Math.floor(resource.rating))}${resource.rating % 1 ? '½' : ''} 
                (${resource.rating.toFixed(1)})
            </div>
        `;

        card.addEventListener('click', () => showResourceDetails(resource));
        resourcesList.appendChild(card);

        // Add marker to map
        const marker = new google.maps.Marker({
            position: { lat: resource.lat, lng: resource.lng },
            map,
            title: resource.name
        });
        markers.push(marker);
    });
}

// Clear map markers
function clearMarkers() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
}

// Show resource details in modal
function showResourceDetails(resource) {
    modalContent.innerHTML = `
        <h2>${resource.name}</h2>
        <p><strong>Address:</strong> ${resource.address}</p>
        <p><strong>Phone:</strong> ${resource.phone}</p>
        <p><strong>Hours:</strong> ${resource.hours}</p>
        <div class="rating">
            ${'★'.repeat(Math.floor(resource.rating))}${resource.rating % 1 ? '½' : ''} 
            (${resource.rating.toFixed(1)})
        </div>
        <a href="https://maps.app.goo.gl/BYLQteo5DcC3t8fy7" target="_blank">📍 View on Google Maps</a>
        <div class="review-section">
            <h3>Reviews</h3>
            ${resource.reviews.map(review => `
                <div class="review">
                    <p><strong>${review.user}</strong> - ${'★'.repeat(review.rating)}</p>
                    <p>${review.comment}</p>
                </div>
            `).join('')}
        </div>
    `;
    modal.style.display = 'block';
}

// Filter resources
function filterResources() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedType = resourceType.value;

    const filteredResources = sampleResources.filter(resource => {
        const matchesSearch = resource.name.toLowerCase().includes(searchTerm) ||
                              resource.address.toLowerCase().includes(searchTerm);
        const matchesType = selectedType === 'all' || resource.type === selectedType;

        return matchesSearch && matchesType;
    });

    displayResources(filteredResources);
}

// Get user location
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                map.setCenter({ lat: userLocation.latitude, lng: userLocation.longitude });
                alert('Location detected! Map centered.');
            },
            (error) => {
                alert('Unable to retrieve your location. Please check your location settings.');
                console.error('Error getting location:', error);
            }
        );
    } else {
        alert('Geolocation is not supported by your browser.');
    }
}

// Event Listeners
locationBtn.addEventListener('click', getUserLocation);
searchInput.addEventListener('input', filterResources);
resourceType.addEventListener('change', filterResources);
closeModal.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
});
