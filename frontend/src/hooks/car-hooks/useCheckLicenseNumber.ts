import { useState } from "react";
import useFetch from "../useFetch";
import { toast } from "react-toastify";
import { BackendError } from "../../types/error.types";

const useCheckLicenseNumber = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchWithAuth } = useFetch();

  const checkLicenseNumber = async (
    license_number: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Make sure license_number is URL-safe
      console.log(license_number);
      const response = await fetchWithAuth("/car/check-license", "post", {
        license_number,
      });

      if (!response.ok) {
        const backendError: BackendError = await response.json();
        toast.error(backendError.message);
        return false;
      }

      const notification = await response.json();

      toast.info(notification.message);

      return true; // Assuming the backend sends { exists: true/false }
    } catch (error) {
      console.error("Error checking license number:", error);
      setError("Failed to verify license number.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { checkLicenseNumber, loading, error };
};

export default useCheckLicenseNumber;