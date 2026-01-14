import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Wait for navigation context to be ready before redirecting to splash
    const timer = setTimeout(() => {
      router.replace("/splash");
    }, 100);

    return () => clearTimeout(timer);
  }, [router]);

  return null;
}
