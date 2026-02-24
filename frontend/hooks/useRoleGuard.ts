import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/axios';

export function useRoleGuard(allowedRoles: string[]) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkRole = async () => {
            try {
                const res = await api.get('/users/me');
                const userRole = res.data.data.role;

                if (!allowedRoles.includes(userRole)) {
                    router.push('/admin/unauthorized');
                } else {
                    setIsAuthorized(true);
                }
            } catch (error) {
                router.push('/auth/login');
            } finally {
                setIsLoading(false);
            }
        };

        checkRole();
    }, [router, allowedRoles]);

    return { isAuthorized, isLoading };
}