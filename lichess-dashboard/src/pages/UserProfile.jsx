import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getUserProfile } from '../services/lichess';
import { ArrowPathIcon, UserIcon, TrophyIcon, ClockIcon, UserGroupIcon, CalendarIcon, GlobeAltIcon, LinkIcon } from '@heroicons/react/24/outline';

const StatCard = ({ icon, label, value, className = '' }) => {
  const Icon = icon;
  return (
  <div className={`bg-white p-4 rounded-lg shadow-sm border border-gray-100 ${className}`}>
    <div className="flex items-center">
      <div className="p-2 rounded-full bg-lichess-blue bg-opacity-10 text-lichess-blue mr-3">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-lg font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
  );
};

const RatingBadge = ({ variant, rating, progress }) => {
  const variants = {
    bullet: { bg: 'bg-amber-100 text-amber-800', label: 'Bullet' },
    blitz: { bg: 'bg-blue-100 text-blue-800', label: 'Blitz' },
    rapid: { bg: 'bg-green-100 text-green-800', label: 'Rapid' },
    classical: { bg: 'bg-purple-100 text-purple-800', label: 'Classical' },
    correspondence: { bg: 'bg-indigo-100 text-indigo-800', label: 'Correspondence' },
    puzzle: { bg: 'bg-pink-100 text-pink-800', label: 'Puzzle' },
  };

  const { bg, label } = variants[variant] || { bg: 'bg-gray-100 text-gray-800', label: variant };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 rounded-t-lg border border-b-0 border-gray-200">
        <div className="flex items-center justify-between">
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${bg}`}>
            {label}
          </span>
          <span className="text-sm text-gray-500">Rating</span>
        </div>
        <div className="mt-2 flex items-baseline">
          <span className="text-2xl font-bold text-gray-900">{rating}</span>
          {progress !== 0 && (
            <span className={`ml-2 text-sm font-medium ${progress > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {progress > 0 ? '↑' : '↓'} {Math.abs(progress)}
            </span>
          )}
        </div>
      </div>
      <div className="px-4 py-2 bg-gray-50 rounded-b-lg border border-t-0 border-gray-200 text-xs text-gray-500">
        <span>Percentile: Top {Math.max(1, 100 - (rating / 3000 * 100)).toFixed(1)}%</span>
      </div>
    </div>
  );
};

export const UserProfile = () => {
  const { username: urlUsername } = useParams();
  const navigate = useNavigate();
  const [username, setUsername] = useState(urlUsername || '');
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(!!urlUsername);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchProfile = useCallback(async (username) => {
    if (!username?.trim()) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const data = await getUserProfile(username);
      setProfile(data);
      setError(null);
      // Update URL if different from current
      if (username !== urlUsername) {
        navigate(`/profile/${username}`, { replace: true });
      }
      return data;
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to fetch profile. Please check the username and try again.');
      setProfile(null);
      throw err;
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [navigate, urlUsername]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchProfile(username);
  };

  const handleRefresh = () => {
    if (!profile) return;
    setIsRefreshing(true);
    fetchProfile(profile.username);
  };

  // Load profile if URL has a username
  useEffect(() => {
    if (urlUsername) {
      setUsername(urlUsername);
      fetchProfile(urlUsername);
    }
  }, [urlUsername, fetchProfile]);

  // Calculate account age
  const getAccountAge = (createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    
    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''}${months > 0 ? `, ${months} month${months > 1 ? 's' : ''}` : ''}`;
    }
    return `${months} month${months !== 1 ? 's' : ''}`;
  };

  // Format last seen time
  const formatLastSeen = (lastSeen) => {
    const lastSeenDate = new Date(lastSeen);
    const now = new Date();
    const diffMs = now - lastSeenDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Online now';
    if (diffMins < 60) return `Last seen ${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
    if (diffHours < 24) return `Last seen ${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    if (diffDays < 7) return `Last seen ${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    return `Last seen on ${lastSeenDate.toLocaleDateString()}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Player Profile</h1>
          <p className="mt-2 text-sm text-gray-500">
            Search for a Lichess username to view detailed statistics and performance metrics
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-4 md:mt-0 w-full md:w-auto">
          <div className="flex rounded-md shadow-sm">
            <div className="relative flex-grow focus-within:z-10">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter Lichess username"
                className="focus:ring-lichess-blue focus:border-lichess-blue block w-full rounded-none rounded-l-md pl-10 sm:text-sm border-gray-300"
                disabled={isLoading}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !username.trim()}
              className={`-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md ${
                isLoading || !username.trim()
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-lichess-blue text-white hover:bg-lichess-green border-transparent'
              } focus:outline-none focus:ring-2 focus:ring-lichess-blue focus:ring-offset-2`}
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading profile</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {isLoading && !profile ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lichess-blue"></div>
        </div>
      ) : profile ? (
        <div className="space-y-6">
          {/* Profile Header */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-start">
              <div className="flex items-center">
                <div className="relative">
                  <img 
                    src={profile.profile?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.username}`} 
                    alt={`${profile.username}'s avatar`}
                    className="h-20 w-20 rounded-full border-4 border-white shadow-sm"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${profile.username}`;
                    }}
                  />
                  {profile.online && (
                    <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white"></span>
                  )}
                </div>
                <div className="ml-6">
                  <div className="flex items-center">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {profile.username}
                    </h2>
                    {profile.title && (
                      <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                        {profile.title.toUpperCase()}
                      </span>
                    )}
                    <button
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                      className="ml-3 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lichess-blue"
                      title="Refresh data"
                    >
                      <ArrowPathIcon className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                  
                  {profile.profile?.bio && (
                    <p className="mt-1 text-gray-600">{profile.profile.bio}</p>
                  )}
                  
                  <div className="mt-2 flex flex-wrap gap-2">
                    {profile.profile?.country && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <GlobeAltIcon className="h-3 w-3 mr-1" />
                        {profile.profile.country}
                      </span>
                    )}
                    {profile.profile?.location && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {profile.profile.location}
                      </span>
                    )}
                    {profile.patron && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        ♛ Patron
                      </span>
                    )}
                    {profile.verified && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-1">
                <a
                  href={`https://lichess.org/@/${profile.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lichess-blue"
                >
                  <LinkIcon className="h-4 w-4 mr-1.5" />
                  View on Lichess
                </a>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard 
              icon={TrophyIcon} 
              label="Total Games" 
              value={profile.count?.all?.toLocaleString() || '0'} 
            />
            <StatCard 
              icon={ClockIcon} 
              label="Account Age" 
              value={getAccountAge(profile.createdAt)} 
            />
            <StatCard 
              icon={UserGroupIcon} 
              label="Followers" 
              value={profile.nbFollowers?.toLocaleString() || '0'} 
            />
            <StatCard 
              icon={CalendarIcon} 
              label="Last Seen" 
              value={formatLastSeen(profile.seenAt).split(' ')[0] === 'Online' ? 'Now' : formatLastSeen(profile.seenAt).replace('Last seen ', '')} 
              className={profile.online ? 'ring-2 ring-green-500' : ''}
            />
          </div>

          {/* Ratings Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ratings</h3>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(profile.perfs || {}).map(([key, value]) => (
                <RatingBadge 
                  key={key}
                  variant={key}
                  rating={value.rating}
                  progress={value.prog || 0}
                />
              ))}
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium text-gray-900">Additional Information</h3>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Account Created</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {new Date(profile.createdAt).toLocaleDateString()} ({getAccountAge(profile.createdAt)} ago)
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Last Online</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {formatLastSeen(profile.seenAt)}
                    {profile.playing && ' (Currently playing)'}
                  </dd>
                </div>
                {profile.profile?.firstName && (
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {profile.profile.firstName} {profile.profile.lastName || ''}
                    </dd>
                  </div>
                )}
                {profile.profile?.links && (
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Social Links</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 space-y-2">
                      {profile.profile.links.split(' ').map((link, index) => (
                        <a 
                          key={index} 
                          href={link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-lichess-blue hover:underline block truncate"
                        >
                          {link.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                        </a>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No profile selected</h3>
          <p className="mt-1 text-sm text-gray-500">
            Search for a Lichess username to get started.
          </p>
        </div>
      )}
    </div>
  );
};
