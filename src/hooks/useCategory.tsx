import { http } from '../service';
import { useEffect, useState } from 'react';

export function useCategory() {
    const [categories, setCategories] = useState<string[]>([]);

    async function getCategories() {
        try {
            const response = await http.get('/products/categories');
            setCategories(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getCategories();
    }, []);

    return { categories };
}
