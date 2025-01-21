import { useAuthStore } from '@/store/authStore';

export function UserProfile() {
    const { identity, isAuthenticated } = useAuthStore();

    if (!isAuthenticated || !identity) {
        return null;
    }

    return (
        <div className="flex items-center justify-center space-x-4 px-4">
            <div>
                <div className="text-sm text-gray-500">{identity.email}</div>
            </div>
        </div>
    );
}