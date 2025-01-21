import { useAuthStore } from '@/store/authStore';

export function UserProfile() {
    const { identity, isAuthenticated } = useAuthStore();

    if (!isAuthenticated || !identity) {
        return null;
    }

    return (
        <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow">
            <img
                src={identity.picture}
                alt={identity.name}
                className="w-10 h-10 rounded-full"
            />
            <div>
                <div className="font-medium text-gray-900">{identity.name}</div>
                <div className="text-sm text-gray-500">{identity.email}</div>
            </div>
        </div>
    );
}