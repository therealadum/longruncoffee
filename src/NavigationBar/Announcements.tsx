import { useState, useEffect } from "react";

interface UseTypewriterOptions {
  speed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
}

const isTesting = process.env.NODE_ENV === "test";

const useTypewriter = (
  texts: string[],
  options: UseTypewriterOptions = {},
): string => {
  if (isTesting) {
    return texts[0];
  }

  const { speed = 150, deleteSpeed = 100, pauseDuration = 1000 } = options;
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loop, setLoop] = useState(0);

  useEffect(() => {
    const handleTyping = () => {
      const fullText = texts[currentIndex];
      setCurrentText((prev) =>
        isDeleting
          ? fullText.substring(0, prev.length - 1)
          : fullText.substring(0, prev.length + 1),
      );

      if (!isDeleting && currentText === fullText) {
        setTimeout(() => setIsDeleting(true), pauseDuration);
      } else if (isDeleting && currentText === "") {
        setIsDeleting(false);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
        setLoop((prevLoop) => prevLoop + 1);
      }
    };

    const typingSpeed = isDeleting ? deleteSpeed : speed;
    const timeoutId = setTimeout(handleTyping, typingSpeed);

    return () => clearTimeout(timeoutId);
  }, [
    currentText,
    isDeleting,
    currentIndex,
    texts,
    speed,
    deleteSpeed,
    pauseDuration,
  ]);

  return currentText;
};

interface IAnnouncementsProps {
  texts: string[];
}

export default function Announcements({ texts }: IAnnouncementsProps) {
  const text = useTypewriter(texts, {
    speed: 50,
    deleteSpeed: 50,
    pauseDuration: 4000,
  });
  return (
    <p className="flex h-10 items-center justify-center bg-cyan-600 px-4 text-sm font-medium text-white sm:px-6 lg:px-8">
      {text}
    </p>
  );
}
