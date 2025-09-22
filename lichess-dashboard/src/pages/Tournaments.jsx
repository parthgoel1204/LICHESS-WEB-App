import { useState, useEffect } from 'react';
import { getTournaments } from '../services/lichess';

export const Tournaments = () => {
  const [tournaments, setTournaments] = useState({
    created: [],
    started: [],
    finished: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('started');

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getTournaments();
        setTournaments(data);
      } catch (err) {
        setError('Failed to fetch tournaments. Please try again later.');
        console.error('Error fetching tournaments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
    
    // Refresh tournaments every 60 seconds
    const interval = setInterval(fetchTournaments, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatTimeLeft = (startsAt) => {
    const now = new Date();
    const start = new Date(startsAt);
    const diffMs = start - now;
    
    if (diffMs <= 0) return 'Starting now';
    
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const days = Math.floor(diffHours / 24);
    const hours = diffHours % 24;
    const minutes = diffMins % 60;
    
    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0 || parts.length === 0) parts.push(`${minutes}m`);
    
    return `Starts in ${parts.join(' ')}`;
  };

  const getStatusBadge = (tournament) => {
    const now = new Date().getTime();
    const start = new Date(tournament.startsAt).getTime();
    const end = new Date(tournament.finishesAt).getTime();
    
    if (now < start) {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800">
          Upcoming
        </span>
      );
    } else if (now >= start && now <= end) {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-800">
          In Progress
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-800">
          Completed
        </span>
      );
    }
  };

  const renderTournamentCard = (tournament) => (
    <div key={tournament.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">{tournament.fullName}</h3>
          {getStatusBadge(tournament)}
        </div>
        
        <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
          <div>
            <div className="font-medium">Time Control</div>
            <div>{tournament.clock.limit / 60} + {tournament.clock.increment}</div>
          </div>
          <div>
            <div className="font-medium">Players</div>
            <div>{tournament.nbPlayers} / {tournament.limit || '∞'}</div>
          </div>
          <div>
            <div className="font-medium">Variant</div>
            <div className="capitalize">{tournament.variant.replace(/-/g, ' ')}</div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100 text-sm">
          <div className="flex justify-between">
            <div>
              <div className="font-medium">Starts</div>
              <div>{formatDate(tournament.startsAt)}</div>
              {new Date(tournament.startsAt) > new Date() && (
                <div className="text-blue-600 mt-1">
                  {formatTimeLeft(tournament.startsAt)}
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="font-medium">Duration</div>
              <div>{tournament.minutes} minutes</div>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <a
            href={`https://lichess.org/tournament/${tournament.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full text-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors duration-200"
          >
            Join Tournament
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Chess Tournaments</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          {error}
        </div>
      ) : (
        <>
          <div className="flex border-b mb-6">
            <button
              onClick={() => setActiveTab('started')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'started'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              In Progress
              {tournaments.started.length > 0 && (
                <span className="ml-2 bg-blue-100 text-blue-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {tournaments.started.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('created')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'created'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Upcoming
              {tournaments.created.length > 0 && (
                <span className="ml-2 bg-blue-100 text-blue-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {tournaments.created.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('finished')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'finished'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Completed
              {tournaments.finished.length > 0 && (
                <span className="ml-2 bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {tournaments.finished.length}
                </span>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTab === 'started' && tournaments.started.map(renderTournamentCard)}
            {activeTab === 'created' && tournaments.created.map(renderTournamentCard)}
            {activeTab === 'finished' && tournaments.finished.map(renderTournamentCard)}
            
            {activeTab === 'started' && tournaments.started.length === 0 && (
              <div className="col-span-full text-center py-10 text-gray-500">
                No tournaments in progress right now. Check back later!
              </div>
            )}
            
            {activeTab === 'created' && tournaments.created.length === 0 && (
              <div className="col-span-full text-center py-10 text-gray-500">
                No upcoming tournaments scheduled yet.
              </div>
            )}
            
            {activeTab === 'finished' && tournaments.finished.length === 0 && (
              <div className="col-span-full text-center py-10 text-gray-500">
                No recently completed tournaments.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
