import { useState, useEffect } from "react";

export function useSessionTime(seconds: number) {
  const [timeOnSite, setTimeOnSite] = useState<number>(() => {
    // Get the previously stored time from localStorage or start at 0
    const savedTime = localStorage.getItem("timeOnSite");
    return savedTime ? parseInt(savedTime, 10) : 0;
  });

  useEffect(() => {
    // Function to update the time in localStorage before the user leaves
    const updateTimeInLocalStorage = () => {
      localStorage.setItem("timeOnSite", timeOnSite.toString());
    };

    // Track time spent on the site using setInterval
    const intervalId = setInterval(() => {
      setTimeOnSite((prevTime) => prevTime + 1);
    }, 1000);

    // Add event listener to store time in localStorage before user leaves
    window.addEventListener("beforeunload", updateTimeInLocalStorage);

    // Clean up interval and event listener when the component unmounts
    return () => {
      clearInterval(intervalId);
      window.removeEventListener("beforeunload", updateTimeInLocalStorage);
      // Save the time to localStorage in case the component unmounts
      updateTimeInLocalStorage();
    };
  }, [timeOnSite]);

  return timeOnSite > seconds;
}
