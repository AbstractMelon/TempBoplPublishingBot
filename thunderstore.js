const axios = require('axios');

async function getNewModReleases() {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    try {
        console.log('Fetching new mod releases...');
        const response = await axios.get(`https://thunderstore.io/api/v1/mod`, {
            params: {
                sort: 'datecreated:desc',
                before: today
            }
        });
        console.log('Mod releases fetched successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error(`Error fetching new mod releases: ${error.message}`);
        throw error;
    }
}

// Example usage
getNewModReleases()
    .then(mods => {
        console.log('New mod releases:', mods);
    })
    .catch(error => {
        console.error('Error:', error.message);
    });
