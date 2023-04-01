import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { trpc } from "../utils/trpc";

const Home = () => {
  const navigator = useNavigate();

  const [packageId, setPackageId] = useState<string>("");
  const [error, setError] = useState<string>("");

  const { data: packageDetails, refetch } =
    trpc.package.packageDetailsPublic.useQuery(
      {
        package_id: packageId,
      },
      { enabled: false, refetchOnWindowFocus: false }
    );

  const handleClick = () => {
    refetch();
  };

  useEffect(() => {
    console.log("DATA", packageDetails);
    if (packageDetails?.status === "success") {
      navigator(`package/${packageId}`, {
        state: { data: packageDetails?.packageDetails },
      });
    } else if (packageDetails?.status === "error") {
      setError("Package not found");
    }
  }, [packageDetails]);
  return (
    <div className="flex items-center justify-center mt-36">
      {/* a big search bar in the middle of the screen for tracking a package */}
      <div className="flex flex-col w-full gap-4 justify-center items-center align-middle">
        <h1 className="text-4xl font-bold text-center">Track your package</h1>
        {error.length > 1 && <p className="text-red-500">{error}</p>}
        <input
          type="text"
          className="w-1/2 h-14 border-2 border-gray-300 rounded-lg px-4 text-black bg-[#E5E5E5]"
          placeholder="Enter your tracking number"
          onChange={(e) => {
            setPackageId(e.target.value);
            setError("");
          }}
        />

        <button
          className="bg-calm-yellow text-black px-6 py-2 rounded-lg"
          onClick={handleClick}
        >
          Track
        </button>
      </div>
    </div>
  );
};

export default Home;
