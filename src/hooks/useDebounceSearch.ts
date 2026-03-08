'use client';

import { useState } from 'react';
import { useDebounce } from 'use-debounce';

export const useDebounceSearch = (delay = 300) => {
    const [search, setSearch] = useState('');
    const [debouncedSearch] = useDebounce(search, delay);
    return { search, setSearch, debouncedSearch };
};
