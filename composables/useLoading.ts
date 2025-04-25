export const useLoading = () => {
  const isLoading = useState("isLoading", () => false);

  const startLoading = () => {
    isLoading.value = true;
  };

  const stopLoading = () => {
    isLoading.value = false;
  };

  return { isLoading, startLoading, stopLoading };
};
