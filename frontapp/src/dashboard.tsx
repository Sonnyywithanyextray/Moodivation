import React, { useState } from 'react';
import { Smile, Meh, Frown, Leaf } from 'lucide-react';
import { User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
interface DashboardProps {
  user: User;
  onLogout: () => Promise<void>;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [mood, setMood] = useState(50);
  const navigate = useNavigate();

  return (
    <div className="bg-black text-white min-h-screen p-4">
      <div className="max-w-md mx-auto">
        {/* Welcome Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button onClick={() => navigate("/profile")}><img src="/api/placeholder/40/40" alt="User" className="w-10 h-10 rounded-full mr-3" />
            </button>
            <div>
              <h1 className="text-xl font-semibold">Welcome back!</h1>
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>
          </div>
          <div className="bg-green-500 text-black rounded-full w-8 h-8 flex items-center justify-center font-bold">
            4
          </div>
        </div>

        {/* Mood Tracker */}
        <div className="bg-green-100 rounded-lg p-4 mb-4">
          <p className="text-black mb-2 font-medium">How are you feeling today?</p>
          <div className="flex justify-between items-center">
            <Smile className="text-green-500" size={24} />
            <input
              type="range"
              min="0"
              max="100"
              value={mood}
              onChange={(e) => setMood(parseInt(e.target.value))}
              className="w-full mx-4 accent-green-500"
            />
            <Frown className="text-red-500" size={24} />
          </div>
        </div>

        {/* Mood Overview */}
        <div className="bg-purple-200 rounded-lg p-4 mb-4">
          <div className="flex items-center mb-3">
            <Leaf className="text-green-500 mr-2" size={20} />
            <p className="text-black font-medium text-sm">"Your potential is endless. Keep pushing forward!"</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-black text-xs">
            <div>
              <p className="font-bold">Mood overview</p>
              <p>Positive</p>
            </div>
            <div>
              <p className="font-bold">Gratitude journal</p>
              <p>Mindfulness</p>
            </div>
            <div>
              <p className="font-bold">Stress level</p>
              <p>Calmness</p>
            </div>
          </div>
        </div>

        {/* Activities Section */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Your activities for</h2>
          <button className="bg-green-500 text-black px-3 py-1 rounded text-sm font-medium">
            Today
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;