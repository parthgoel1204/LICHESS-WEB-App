import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/20/solid';

export const Home = () => {
  return (
    <div className="min-h-[calc(100vh-12rem)] flex flex-col">
      {/* Hero Section */}
      <div className="bg-lichess-dark text-lichess-board-light py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              <span className="block">Chess Analytics</span>
              <span className="block text-lichess-board-light">Powered by Lichess API</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-lichess-board-light opacity-90">
              Explore player statistics, tournament data, and leaderboards from the world's largest free chess server.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Discover Chess Insights
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Everything you need to analyze and explore the world of chess in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard 
              title="Player Profiles" 
              description="Search and view detailed chess player profiles, ratings, and game statistics."
              link="/profile"
              linkText="Search Players"
              icon="👤"
              color="blue"
            />
            <FeatureCard 
              title="Leaderboards" 
              description="Check out the top chess players across different time controls and variants."
              link="/leaderboards"
              linkText="View Rankings"
              icon="🏆"
              color="green"
            />
            <FeatureCard 
              title="Tournaments" 
              description="Discover ongoing and upcoming chess tournaments from around the world."
              link="/tournaments"
              linkText="Browse Events"
              icon="♟️"
              color="purple"
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-lichess-board-light py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-lichess-blue rounded-lg shadow-xl overflow-hidden lg:grid lg:grid-cols-2 lg:gap-4">
            <div className="pt-10 pb-12 px-6 sm:pt-16 sm:px-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
              <div className="lg:self-center">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                  <span className="block">Ready to dive in?</span>
                  <span className="block">Start exploring now.</span>
                </h2>
                <p className="mt-4 text-lg leading-6 text-lichess-board-light">
                  Join thousands of chess enthusiasts analyzing games and improving their skills.
                </p>
                <Link
                  to="/profile"
                  className="mt-8 bg-white border border-transparent rounded-md shadow px-5 py-3 inline-flex items-center text-base font-medium text-lichess-dark hover:bg-gray-50 transition-colors duration-200"
                >
                  Get Started
                  <ArrowRightIcon className="ml-3 -mr-1 h-5 w-5" aria-hidden="true" />
                </Link>
              </div>
            </div>
            <div className="-mt-6 aspect-w-5 aspect-h-3 md:aspect-w-2 md:aspect-h-1">
              <img
                className="transform translate-x-6 translate-y-6 rounded-md object-cover object-left-top sm:translate-x-16 lg:translate-y-20"
                src="https://images.unsplash.com/photo-1604948501466-4e9c339b9c24?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                alt="Chess board with pieces"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ title, description, link, linkText, icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
    green: 'bg-green-50 text-green-700 hover:bg-green-100',
    purple: 'bg-purple-50 text-purple-700 hover:bg-purple-100',
  };

  const iconBgClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <div className="relative bg-white pt-6 px-6 pb-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-lichess-blue to-lichess-green"></div>
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${iconBgClasses[color]}`}>
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      <div className="mt-auto">
        <Link
          to={link}
          className={`inline-flex items-center text-sm font-medium ${colorClasses[color]} px-4 py-2 rounded-md transition-colors duration-200`}
        >
          {linkText}
          <ArrowRightIcon className="ml-2 -mr-1 h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
};
