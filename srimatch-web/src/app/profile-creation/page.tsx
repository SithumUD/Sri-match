import ProtectedRoute from "@/components/ProtectedRoute";
import ProfileCreationPage from "@/views/ProfileCreationPage";

export const metadata = {
  title: "Complete Your Profile | SriMatch",
};

export default function Page() {
  return (
    <ProtectedRoute>
      <ProfileCreationPage />
    </ProtectedRoute>
  );
}
