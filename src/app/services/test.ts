import { fetchTaxons, fetchProductsByTaxonId } from './api';

const catalogOwnerId = '1239'; // example

async function testServices() {
    try {
        // Test taxons
        const taxons = await fetchTaxons(catalogOwnerId);
        console.log('Taxons:', taxons);

        if (taxons.length > 0) {
            // Pick the first taxon to test products
            const taxonId = taxons[5].id;
            const products = await fetchProductsByTaxonId(catalogOwnerId, taxonId);
            console.log(`Products for taxon ${taxonId}:`, products);
        }
    } catch (err) {
        console.error('Error:', err);
    }
}

testServices();