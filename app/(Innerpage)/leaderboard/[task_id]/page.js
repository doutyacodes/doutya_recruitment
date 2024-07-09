"use client"
import { baseImgURL } from '@/lib/baseData';
import Image from 'next/image';
import { useEffect, useState } from 'react';

// Sample fake data for demonstration
const fakeLeaderBoard = {
  first_place: {
    rank: 1,
    image: 'reactjs.png',
    name: 'John Doe',
    marks: 95,
    id: 1,
  },
  second_place: {
    rank: 2,
    image: 'reactjs.png',
    first_character: 'JD',
    name: 'Jane Smith',
    marks: 90,
    id: 2,
  },
  third_place: {
    rank: 3,
    image: 'reactjs.png',
    name: 'Mike Johnson',
    marks: 85,
    id: 3,
  },
  others: [
    {
      rank: 4,
      image: 'reactjs.png',
      name: 'Emily Brown',
      marks: 80,
      id: 4,
    },
    {
      rank: 5,
      image: 'reactjs.png',
      name: 'Chris Wilson',
      marks: 75,
      id: 5,
    },
  ],
  user_place: {
    rank: 1,
    image: 'reactjs.png',
    name: 'John Doe',
    marks: 95,
    id: 1,
  },
};

const QuizLeaderScreen = () => {
  const [leaderBoard, setLeaderBoard] = useState(fakeLeaderBoard);
  const user_id = 3;

  useEffect(() => {
    // Simulating API call
    // Replace with actual API call using axios in real scenario
    // axios.get(...)
    //   .then(response => {
    //     setLeaderBoard(response.data);
    //   })
    //   .catch(error => {
    //     console.error('Error fetching data:', error);
    //   });

    // Simulating delay for demonstration
    const timer = setTimeout(() => {
      console.log('Navigation logic after 10 seconds');
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white">
      <Image
        src="/images/doodle.jpg"
        alt="Background Image"
        layout="fill"
        objectFit="cover"
        className="opacity-10"
      />

      <div className="p-4">
        <h1 className="text-center text-3xl font-bold mt-14 mb-6">Leaderboard</h1>

        {/* Loop through other leaderboard entries */}
        {Object.keys(leaderBoard).map((key) => {
          if (key === 'user_place') {
            return null; // Skip user's own score in this loop
          }

          const entry = leaderBoard[key];

          return (
            <div key={entry.id} className="mb-4">
              <div className="flex items-center px-3 py-2 rounded-lg gap-2 shadow-md bg-white">
                <span className="font-bold">#{entry.rank}</span>
                {entry.image ? (
                  <Image
                    src={baseImgURL+entry.image}
                    alt="User Image"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                    <span className="text-white text-sm">
                      {entry.first_character || ''}
                    </span>
                  </div>
                )}
                <span
                  className={`font-bold ${entry.id === user_id ? 'text-red-500' : 'text-black'}`}
                >
                  {entry.name}
                </span>
                <span className="font-bold">{entry.marks}</span>
              </div>
            </div>
          );
        })}

        {/* Render user's own score separately */}
        {leaderBoard?.user_place && (
          <div className="mb-4">
            <h2 className="text-2xl font-bold mt-6 mb-2">Your Score</h2>
            <div className="flex items-center px-3 py-2 rounded-lg gap-2 shadow-md bg-white">
              <span className="font-bold text-3xl">#{leaderBoard.user_place.rank}</span>
              {leaderBoard.user_place.image ? (
                <Image
                  src={baseImgURL+ leaderBoard.user_place.image}
                  alt="User Image"
                  width={64}
                  height={64}
                  className="rounded-full"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center">
                  <span className="text-white text-3xl">
                    {leaderBoard.user_place.first_character}
                  </span>
                </div>
              )}
              <span className="font-bold text-2xl">{leaderBoard.user_place.name}</span>
              <span className="font-bold text-2xl">{leaderBoard.user_place.marks}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizLeaderScreen;
