import { AuthProvider } from "./auth/SessionProvider";
import RoutesPage from "./RoutesPage";

const Index = () => {
  return (
    <>
      <AuthProvider>
        <RoutesPage />
      </AuthProvider>
    </>
  );
};

export default Index;
