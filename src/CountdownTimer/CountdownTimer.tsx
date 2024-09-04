import { memo, useEffect, useRef, useState } from "react";

const useCountdown = (initialTimer: any) => {
  const milisecond = useRef(initialTimer * 1000);
  const previous: any = useRef(milisecond);
  const [timer, setTimer] = useState(initialTimer);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying || milisecond.current <= 0) return;

    let effectInitialMs = milisecond.current;
    let effectInitialTimeStamp: any, handle: any;

    const step = (timestampMs: any) => {
      if (effectInitialTimeStamp === undefined)
        effectInitialTimeStamp = timestampMs;
      const elapsed = timestampMs - effectInitialTimeStamp;
      milisecond.current = effectInitialMs - elapsed;

      if (milisecond.current <= 0) {
        setTimer(0);
        console.log("cancelAnimationFrame(zero)", handle, milisecond.current);
        cancelAnimationFrame(handle);
      } else {
        const seconds = Math.floor(milisecond.current / 1000);
        const isUpdate = seconds !== Math.floor(previous.current / 1000);
        previous.current = milisecond.current;

        if (isUpdate) {
          setTimer(seconds);
        }

        if (isPlaying) {
          handle = window.requestAnimationFrame(step);
        }
      }
    };

    handle = window.requestAnimationFrame(step);

    return () => {
      console.log("cancelAnimationFrame(pause)", handle, milisecond.current);
      cancelAnimationFrame(handle);
    };
  }, [isPlaying]);

  return timer;
};

function getSecondsBetweenDates(date1: any, date2: any) {
  // Ensure both arguments are Date objects
  if (!(date1 instanceof Date) || !(date2 instanceof Date)) {
    throw new Error("Both arguments must be Date objects.");
  }
  // Calculate the difference in milliseconds
  //   @ts-ignore
  const differenceInMilliseconds = Math.abs(date2 - date1);
  // Convert milliseconds to seconds
  const differenceInSeconds = differenceInMilliseconds / 1000;
  return differenceInSeconds;
}

function convertSeconds(seconds: number) {
  // Validate input
  if (typeof seconds !== "number" || seconds < 0) {
    throw new Error("Input must be a non-negative number.");
  }

  const days = Math.floor(seconds / (24 * 3600));
  seconds %= 24 * 3600;
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  seconds %= 60;

  return {
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
  };
}

function CountdownTimer({ date }: any) {
  const timer = useCountdown(getSecondsBetweenDates(new Date(), date));
  const { days, hours, minutes, seconds } = convertSeconds(timer);

  return (
    <div className="grid grid-cols-4 gap-3 max-w-md self-center w-full">
      <div className="rounded-md bg-cyan-50 py-4 flex flex-col">
        <p className="font-accent text-3xl text-center text-cyan-700">{days}</p>
        <p className="font-medium text-sm text-center text-cyan-600">Days</p>
      </div>
      <div className="rounded-md bg-cyan-50 py-4 flex flex-col">
        <p className="font-accent text-3xl text-center text-cyan-700">
          {hours}
        </p>
        <p className="font-medium text-sm text-center text-cyan-600">Hours</p>
      </div>
      <div className="rounded-md bg-cyan-50 py-4 flex flex-col">
        <p className="font-accent text-3xl text-center text-cyan-700">
          {minutes}
        </p>
        <p className="font-medium text-sm text-center text-cyan-600">Minutes</p>
      </div>
      <div className="rounded-md bg-cyan-50 py-4 flex flex-col">
        <p className="font-accent text-3xl text-center text-cyan-700">
          {seconds}
        </p>
        <p className="font-medium text-sm text-center text-cyan-600">Seconds</p>
      </div>
    </div>
  );
}

const CountdownMemo = memo(CountdownTimer);

export { CountdownMemo as CountdownTimer };
